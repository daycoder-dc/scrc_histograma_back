import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { HistoricoDto } from "./historico.dto";
import { HttpService } from "@nestjs/axios";
import { DataSource } from "typeorm";

@Injectable()
export class HistoricoService {
  constructor (
    private readonly dt: DataSource,
    private readonly http: HttpService
  ) {}

  async find_all() {
    return this.dt.query<any[]>(`
      select distinct h.nic, h.orden, h.zona, h.tipo_brigada,
      h.tipo_os, h.tecnico, to_char(h.fecha, 'YYYY-MM') as periodo,
      h.fecha, h.hora::time, to_char(h.hora::time, 'HH24:00') as tiempo,
      m.estado, m.valor_unitario, subaccion_subanomalia as tipo_actividad,
      to_char(h.fecha, 'DD') as periodo_dia
      FROM historico h
      left join maestro m on m.accion = h.accion
      WHERE h.eliminado = $1
      and h.fecha is not null
      and h.tipo_brigada is not null
      and h.tecnico is not null
      order by h.fecha asc, h.hora::time asc;
    `, [false]);
  }

  async upload_file(file:Express.Multer.File, data:HistoricoDto) {
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

    // registrar el archivo a cargar
    {
      const sql_result = await this.dt.query(`
        insert into archivo (nombre, zona) values ($1, $2) returning id
      `, [file.originalname, data.zona]);

      const archivo_id =sql_result[0].archivo_id;
      const ms_host = process.env.MICROSERVICE_HOST!
      const ms_apikey = process.env.MICROSERVICE_API_KEY!

      this.http.postForm(`${ms_host}/api/v1/history/upload`,{archivo_id, file}, {
        headers: {"X-API-KEY": ms_apikey},
        timeout: 5 * 60 * 1000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }).subscribe({
        next: () => {

        },
        error: (e) => {
          console.error(e);
        }
      });
    }

    return {
      "status": "success"
    }
  }
}
