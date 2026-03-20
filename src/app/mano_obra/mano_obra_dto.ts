import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class AllQueryDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({each:true})
  proyectos: string[];

  @IsNotEmpty()
  @IsArray()
  @IsString({each:true})
  periodos:string[];

  @IsNotEmpty()
  @IsArray()
  @IsString({each:true})
  brigadas:string[];

  @IsNotEmpty()
  @IsArray()
  @IsString({each:true})
  tecnicos:string[];
}

export class PeriodosQueryDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({each:true})
  @Transform(({value}) => (Array.isArray(value) ? value :  [value]))
  proyectos: string[];
}

export class BrigadaQueryDto extends PeriodosQueryDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({each:true})
  @Transform(({value}) => (Array.isArray(value) ? value :  [value]))
  periodos:string[];
}

export class TecnicoQueryDto extends BrigadaQueryDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({each:true})
  @Transform(({value}) => (Array.isArray(value) ? value : [value]))
  brigadas:string[];
}


