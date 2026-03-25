import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class ManoObraService {
  constructor (private readonly dt: DataSource) {}

  async all() {
    return this.dt.query<any[]>(`
      SELECT nic, orden, contrata, territorio, zona, municipio, corregimiento,
      localidad_barrio, tarifa, tipo_actividad, actividad, direccion, id_transformador,
      id_circuito, num_medidor, marca_medidor, deuda_act, deuda_cierre, cant_factura_act,
      cant_factura_cierre, tipo_os, descripcion_tipo_os, tipo_suspension_solicitada,
      tipo_brigada, id_tecnico, tecnico, av_resultado, accion, subaccion_subanomalia,
      estado_osf, estado_siprem, to_char(mmo.fecha, 'YYYY-MM') as fecha, hora
      FROM maestro_mano_obra mmo
      WHERE mmo.eliminado = $1
      and mmo.fecha is not null
      and mmo.tipo_brigada is not null
      and mmo.tecnico is not null
    `, [false]);
  }
}
