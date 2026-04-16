import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { SocketGateway } from "@/config/socket-gateway";
import { HistoricoDto } from "./historico.dto";
import { Historico } from "@/entity/historico";
import { HttpService } from "@nestjs/axios";
import { Maestro } from "@/entity/maestro";
import { Archivo } from "@/entity/archivo";
import { DataSource } from "typeorm";
import { Response } from "express";
import FormData from "form-data";
import { Packr } from "msgpackr";
import { gzipSync } from "zlib";

@Injectable()
export class HistoricoService {
  constructor(
    private readonly dt: DataSource,
    private readonly http: HttpService,
    private readonly ws: SocketGateway
  ) { }

  async find_all(res: Response) {
    try {
      const query = await this.dt.createQueryBuilder()
        .from(Historico, "h")
        .innerJoin(Maestro, "m", `m.accion = h.accion and m.zona = (
          case
            when h.zona = 'ATLANTICO NORTE' then 'norte-centro'
            when h.zona = 'ATLANTICO CENTRO' then 'norte-centro'
            when h.zona = 'ATLANTICO SUR' then 'sur'
            else null
          end
        )`)
        .select([
          "h.nic as nic", "h.orden as orden", "h.zona as zona", "h.tipo_brigada as tipo_brigada",
          "h.tipo_os as tipo_os", "h.tecnico as tecnico", "to_char(h.fecha, 'YYYY-MM') as periodo",
          "h.fecha as fecha", "h.hora::time as hora", "to_char(h.hora::time, 'HH24:00') as tiempo",
          "m.estado as estado", "m.valor_unitario as valor_unitario", "h.subaccion_subanomalia as tipo_actividad",
          "to_char(h.fecha, 'DD') as periodo_dia", "h.accion as accion"
        ])
        .where("h.eliminado = false")
        .andWhere("h.fecha is not null")
        .andWhere("h.tipo_brigada is not null")
        .andWhere("h.tecnico is not null")
        .orderBy("h.fecha", "ASC")
        .addOrderBy("h.hora::time", "ASC")
        .cache("history_query_cache")
        .getRawMany();

      const packer = new Packr({
        structuredClone: true,
        useRecords: true
      });

      const buffer = packer.pack(query);
      const compress_buffer = gzipSync(buffer, { level: 6 });

      res.setHeader("Content-Type", "application/x-msgpack");
      res.setHeader("Content-Encoding", "gzip");
      res.setHeader("Content-Length", compress_buffer.length);
      res.send(compress_buffer);
    } catch (e) {
      console.error(e);
      res.sendStatus(500).send(`Database error: ${e?.toString()}`);
    }
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
    return this.dt.createQueryBuilder()
      .from(Archivo, "a")
      .select("a.fecha_registro as fecha_registro")
      .orderBy("a.fecha_registro", "DESC")
      .limit(1)
      .getRawOne();
  }
}
