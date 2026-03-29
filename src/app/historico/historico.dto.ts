import { IsNotEmpty, IsString } from "class-validator";

export class HistoricoDto {
  @IsNotEmpty()
  @IsString()
  zona: string;
}
