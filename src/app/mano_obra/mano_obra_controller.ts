import { ManoObraService } from "./mano_obra_service";
import { Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Mano de obra")
@Controller({path:"manobra", version: "1"})
export class ManoObraController {
  constructor (private readonly service: ManoObraService) {}

  @Post()
  async all() {
    return this.service.all();
  }
}
