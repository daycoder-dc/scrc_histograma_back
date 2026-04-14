import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { EventGateway } from "@/app/event/event.gateway";
import { HistoricoDto } from "./historico.dto";
import { HttpService } from "@nestjs/axios";
import { DataSource } from "typeorm";
import { Response } from "express";
import FormData from "form-data";
import { pack } from "msgpackr"

@Injectable()
export class HistoricoService {
  constructor(
    private readonly dt: DataSource,
    private readonly http: HttpService,
    private readonly ws: EventGateway
  ) { }

  async find_all(res: Response) {
    const result = await this.dt.query(`
      select h.nic, h.orden, h.zona, h.tipo_brigada,
      h.tipo_os, h.tecnico, to_char(h.fecha, 'YYYY-MM') as periodo,
      h.fecha, h.hora::time, to_char(h.hora::time, 'HH24:00') as tiempo,
      m.estado, m.valor_unitario, subaccion_subanomalia as tipo_actividad,
      to_char(h.fecha, 'DD') as periodo_dia, h.accion
      FROM historico h
      inner join maestro m on m.accion = h.accion
      WHERE h.eliminado = false
      and h.fecha is not null
      and h.tipo_brigada is not null
      order by h.fecha asc, h.hora::time asc;
    `);

    const buffer = pack(result);

    res.setHeader("Content-Type", "application/x-msgpack");
    res.setHeader("Content-Length", buffer.length);
    res.send(buffer);
  }

  async upload_file(file: Express.Multer.File, data: HistoricoDto) {
    // verificar si el archivo fue cargado.
    {
      const sql_result = await this.dt.query<any[]>(`
        select count(*) from archivo a
        where a.nombre = $1 and a.eliminado = $2
      `, [file.originalname, false]);

      if (sql_result[0].count > 0) {
        throw new HttpException("FILE_ALREADY_UPLOADED", HttpStatus.BAD_REQUEST)
      }
    }

    const originalname = file.originalname.split(".");
    const timestamp = new Date();

    const filename = [
      `${originalname[0]}`,
      `_${timestamp.getFullYear()}`,
      `${String(timestamp.getMonth() + 1).padStart(2, '0')}`,
      `${String(timestamp.getDate()).padStart(2, '0')}`,
      `${String(timestamp.getHours()).padStart(2, '0')}`,
      `${String(timestamp.getMinutes()).padStart(2, '0')}`,
      `.${originalname[1]}`
    ];

    // registrar el archivo a cargar
    const sql_result = await this.dt.query(`
      insert into archivo (nombre, zona) values ($1, $2) returning id
    `, [filename.join(""), data.zona]);

    const archivo_id = sql_result[0].id;

    const form = new FormData();
    form.append("archivo_id", archivo_id);
    form.append("file", file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype
    });

    this.http.post(`${process.env.MICROSERVICE_HOST!}/ms/v1/history/upload`, form, {
      headers: {
        ...form.getHeaders(),
        "X-API-KEY": process.env.MICROSERVICE_API_KEY!
      },
      timeout: 5 * 60 * 1000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    }).subscribe({
      next: () => {
        this.ws.socket.emit("FILE_LOAD_SUCCESS", archivo_id);
      },
      error: (e) => {
        console.error(e);
        this.ws.socket.emit("FILE_LOAD_ERROR", archivo_id);
      }
    });

    return { "id": archivo_id };
  }

  async get_date_update() {
    return this.dt.query<any[]>(`
      select a.fecha_registro from archivo a
      order by a.fecha_registro desc
      limit 1;
    `);
  }
}
