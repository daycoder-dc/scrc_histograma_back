import { IsNotEmpty, IsString } from "class-validator";

export class MasterDto {
  @IsNotEmpty()
  @IsString()
  zona: string;
}
