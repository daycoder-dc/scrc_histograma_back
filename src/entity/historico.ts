import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ schema: "public", name: "historico" })
export class Historico {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ type: "text", nullable: true })
  archivo_id: string | null;

  @Column({ type: "varchar", nullable: true })
  nic: string | null;

  @Column({ type: "varchar", nullable: true })
  orden: string | null;

  @Column({ type: "varchar", nullable: true })
  contrata: string | null;

  @Column({ type: "varchar", nullable: true })
  territorio: string | null;

  @Column({ type: "varchar", nullable: true })
  zona: string | null;

  @Column({ type: "varchar", nullable: true })
  municipio: string | null;

  @Column({ type: "varchar", nullable: true })
  corregimiento: string | null;

  @Column({ type: "varchar", nullable: true })
  localidad_barrio: string | null;

  @Column({ type: "varchar", nullable: true })
  tarifa: string | null;

  @Column({ type: "varchar", nullable: true })
  tipo_actividad: string | null;

  @Column({ type: "varchar", nullable: true })
  actividad: string | null;

  @Column({ type: "varchar", nullable: true })
  direccion: string | null;

  @Column({ type: "varchar", nullable: true })
  id_transformador: string | null;

  @Column({ type: "varchar", nullable: true })
  id_circuito: string | null;

  @Column({ type: "varchar", nullable: true })
  num_medidor: string | null;

  @Column({ type: "varchar", nullable: true })
  marca_medidor: string | null;

  @Column({ type: "double precision", nullable: true })
  deuda_act: number | null;

  @Column({ type: "double precision", nullable: true })
  deuda_cierre: number | null;

  @Column({ type: "int", nullable: true })
  cant_factura_act: number | null;

  @Column({ type: "int", nullable: true })
  cant_factura_cierre: number | null;

  @Column({ type: "varchar", nullable: true })
  tipo_os: string | null;

  @Column({ type: "varchar", nullable: true })
  descripcion_tipo_os: string | null;

  @Column({ type: "varchar", nullable: true })
  tipo_suspension_solicitada: string | null;

  @Column({ type: "varchar", nullable: true })
  tipo_brigada: string | null;

  @Column({ type: "varchar", nullable: true })
  id_tecnico: string | null;

  @Column({ type: "varchar", nullable: true })
  tecnico: string | null;

  @Column({ type: "varchar", nullable: true })
  av_resultado: string | null;

  @Column({ type: "varchar", nullable: true })
  accion: string | null;

  @Column({ type: "varchar", nullable: true })
  subaccion_subanomalia: string | null;

  @Column({ type: "varchar", nullable: true })
  estado_osf: string | null;

  @Column({ type: "varchar", nullable: true })
  estado_siprem: string | null;

  @Column({ type: "varchar", nullable: true })
  fecha: string | null;

  @Column({ type: "varchar", nullable: true })
  hora: string | null;

  @Column({ type: "boolean", nullable: true, default: false })
  eliminado: boolean;

  @Column({ type: "timestamptz", nullable: true, default: () => "CURRENT_TIMESTAMP" })
  fecha_registro: string;
}
