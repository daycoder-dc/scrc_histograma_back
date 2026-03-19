import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { BrigadaQueryDto } from "./mano_obra_dto";

@Injectable()
export class ManoObraService {
  constructor (private readonly dt: DataSource) {}

  async get_mano_obra() {
    return this.dt.query(`
      SELECT * FROM maestro_mano_obra mmb
      WHERE mmb.eliminado = $1
      -- AND mmb.fecha_registro = CURRENT_DATE
    `, [false]);
  }

  async get_periodos() {
    const data = await this.dt.query(`
      select to_char(mmo.fecha, 'YYYY-MM') as periodo from maestro_mano_obra mmo
      where mmo.eliminado = false
      and mmo.fecha is not null
      group by periodo
      order by periodo desc;
    `);

    return data ?? [];
  }

  async get_zonas(periodos:string[]) {
    const data = await this.dt.query(`
      select mmo.zona
      from maestro_mano_obra mmo
      where to_char(mmo.fecha , 'YYYY-MM') = ANY($1)
      group by mmo.zona
    `, [periodos]);

    return data ?? [];
  }

  async get_brigadas(query:BrigadaQueryDto) {
    // const data = await this.dt.query(`
    //   select mmo.tipo_brigada as brigada
    //   from maestro_mano_obra mmo
    //   where to_char(mmo.fecha , 'YYYY-MM') = any($1)
    //   and mmo.zona = any($2)
    //   and mmo.tipo_brigada is not null
    //   group by mmo.tipo_brigada;
    // `, [query.periodos, query.zonas]);

    // return data ?? [];

    console.log(query);
    return []
  }
}
