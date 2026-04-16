import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ schema: "public", name: "mapa" })
export class Mapa {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", nullable: true })
  nic: string | null;

  @Column({ type: "varchar", nullable: true })
  zona: string | null;

  @Column({ type: "varchar", nullable: true })
  longitud: string | null;

  @Column({ type: "varchar", nullable: true })
  latitud: string | null;

  @Column({ type: "boolean", nullable: true, default: false })
  eliminado: boolean;

  @Column({ type: "timestamptz", nullable: true, default: () => "CURRENT_TIMESTAMP" })
  fecha_registro: string;
}
