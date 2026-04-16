import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ schema: "public", name: "archivo" })
export class Archivo {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", nullable: true })
  nombre: string | null;

  @Column({ type: "varchar", nullable: true })
  zona: string | null;

  @Column({ type: "boolean", nullable: true, default: false })
  eliminado: boolean;

  @Column({ type: "timestamptz", nullable: true, default: () => "CURRENT_TIMESTAMP" })
  fecha_registro: string;
}
