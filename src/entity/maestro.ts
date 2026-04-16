import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ schema: "public", name: "maestro" })
export class Maestro {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text", nullable: true })
  archivo_id: string | null;

  @Column({ type: "varchar", nullable: true })
  accion: string | null;

  @Column({ type: "varchar", nullable: true })
  estado: string | null;

  @Column({ type: "varchar", nullable: true })
  se_paga: string | null;

  @Column({ type: "double precision", nullable: true })
  valor_unitario: number | null;

  @Column({ type: "varchar", nullable: true })
  tipo_actividad: string | null;

  @Column({ type: "varchar", nullable: true })
  zona: string | null;

  @Column({ type: "boolean", nullable: true, default: false })
  eliminado: boolean;

  @Column({ type: "timestamptz", nullable: true, default: () => "CURRENT_TIMESTAMP" })
  fecha_registro: string;
}
