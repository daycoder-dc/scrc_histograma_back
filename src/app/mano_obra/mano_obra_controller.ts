import { BrigadaQueryDto } from "./mano_obra_dto";
import { ManoObraService } from "./mano_obra_service";
import { Controller, Get, ParseArrayPipe, Query } from "@nestjs/common";

@Controller({path:"manobra", version: "1"})
export class ManoObraController {
  constructor (private readonly service: ManoObraService) {}

  @Get()
  async get_mano_obra() {
    return this.service.get_mano_obra();
  }

  @Get("periodos")
  async get_periodos() {
    return this.service.get_periodos();
  }

  @Get("zonas")
  async get_zonas(@Query("periodos", new ParseArrayPipe({items:String, separator:','})) periodos:string[]) {
    return this.service.get_zonas(periodos);
  }

  @Get("brigadas")
  async get_brigadas(@Query() query:BrigadaQueryDto) {
    return this.service.get_brigadas(query);
  }
}
