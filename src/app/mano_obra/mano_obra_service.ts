import { AllQueryDto, BrigadaQueryDto, PeriodosQueryDto, TecnicoQueryDto } from "./mano_obra_dto";
import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class ManoObraService {
  constructor (private readonly dt: DataSource) {}

  async get_mano_obra(query:AllQueryDto) {
    const is_cero = (items:string[]) => {
      return items.includes('0') ? [] : items;
    }

    const proyectos = is_cero(query.proyectos);
    const periodos = is_cero(query.periodos);
    const brigadas = is_cero(query.brigadas);
    const tecnicos = is_cero(query.tecnicos);
    const actividad = [];

    console.log("proyectos:", proyectos);
    console.log("periodos:", periodos);
    console.log("brigada:", brigadas);
    console.log("tecnicos:", tecnicos);

    // const data = await this.dt.query(`
    //   SELECT * FROM maestro_mano_obra mmo
    //   WHERE mmo.eliminado = $1
    //   and (cardinality($2::varchar[]) = 0 or mmo.zona = any($2))
    // `, [false, proyectos]);

    return  [];
  }

  async get_proyectos() {
    const data = await this.dt.query(`
      select mmo.zona as proyecto
      from maestro_mano_obra mmo
      where mmo.eliminado = $1
      group by mmo.zona order by mmo.zona asc;
    `, [false]);

    return data ?? [];
  }

  async get_periodos(query:PeriodosQueryDto) {
    const data = await this.dt.query(`
      select to_char(mmo.fecha, 'YYYY-MM') as periodo
      from maestro_mano_obra mmo
      where mmo.eliminado = false
      and mmo.fecha is not null
      and mmo.zona = any($1)
      and mmo.eliminado = $2
      group by periodo
      order by periodo desc;
    `, [query.proyectos, false]);

    return data ?? [];
  }

  async get_brigadas(query:BrigadaQueryDto) {
    const data = await this.dt.query(`
      select mmo.tipo_brigada as brigada
      from maestro_mano_obra mmo
      where  mmo.zona = any($1)
      and to_char(mmo.fecha , 'YYYY-MM') = any($2)
      and mmo.tipo_brigada is not null
      and mmo.eliminado = $3
      group by mmo.tipo_brigada;
    `, [query.proyectos, query.periodos, false]);

    return data ?? [];
  }

  async get_tecnicos(query:TecnicoQueryDto) {
    const data = await this.dt.query(`
      select mmo.tecnico
      from maestro_mano_obra mmo
      where  mmo.zona = any($1)
      and to_char(mmo.fecha , 'YYYY-MM') = any($2)
      and mmo.tipo_brigada = any($3)
      and mmo.eliminado = $4
      group by mmo.tecnico;
    `, [query.proyectos, query.periodos, query.brigadas, false])

    return data ?? [];
  }
}
