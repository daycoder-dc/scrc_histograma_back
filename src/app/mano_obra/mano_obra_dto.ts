import { IsArray, IsNotEmpty, IsString } from "class-validator"

export class BrigadaQueryDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({each:true})
  periodos:string[];

  @IsNotEmpty()
  @IsArray()
  @IsString({each:true})
  zonas: string[];
}
