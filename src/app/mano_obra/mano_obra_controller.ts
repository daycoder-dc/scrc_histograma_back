import { AllQueryDto, BrigadaQueryDto, PeriodosQueryDto, TecnicoQueryDto } from "./mano_obra_dto";
import { Body, Controller, Get, Patch, Query } from "@nestjs/common";
import { ManoObraService } from "./mano_obra_service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Mano de obra")
@Controller({path:"manobra", version: "1"})
export class ManoObraController {
  constructor (private readonly service: ManoObraService) {}

  @Patch()
  async get_mano_obra(@Body() query:AllQueryDto) {
    return this.service.get_mano_obra(query);
  }

  @Get("proyectos")
  async get_proyectos() {
    return this.service.get_proyectos();
  }

  @Get("periodos")
  async get_periodos(@Query() query:PeriodosQueryDto) {
    return this.service.get_periodos(query);
  }

  @Get("brigadas")
  async get_brigadas(@Query() query:BrigadaQueryDto) {
    return this.service.get_brigadas(query);
  }

  @Get("tecnicos")
  async get_tecnicos(@Query() query:TecnicoQueryDto) {
    return this.service.get_tecnicos(query);
  }
}
