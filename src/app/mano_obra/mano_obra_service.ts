import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class ManoObraService {
  constructor (private readonly dt: DataSource) {}

  async all() {
    return this.dt.query<any[]>(`
      select distinct mmo.nic, mmo.orden, mmo.zona, mmo.tipo_brigada,
      mmo.tipo_os, mmo.tecnico, to_char(mmo.fecha, 'YYYY-MM') as periodo,
      mmo.fecha, mmo.hora::time, to_char(mmo.hora::time, 'HH24:00') as tiempo,
      mpc.estado, mpc.valor_unitario, subaccion_subanomalia as tipo_actividad,
      to_char(mmo.fecha, 'DD') as periodo_dia
      FROM maestro_mano_obra mmo
      left join maestro_pagos_csr mpc on mpc.accion = mmo.accion
      WHERE mmo.eliminado = $1
      and mmo.fecha is not null
      and mmo.tipo_brigada is not null
      and mmo.tecnico is not null
      order by mmo.fecha asc, mmo.hora::time asc;
    `, [false]);
  }
}
