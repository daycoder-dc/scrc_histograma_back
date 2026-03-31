import { Body, Controller, FileTypeValidator, Get, ParseFilePipe,
  Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { HistoricoService } from "./historico.service";
import { HistoricoDto } from "./historico.dto";
import { ApiTags } from "@nestjs/swagger";

const mimeType = /(application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|application\/vnd\.ms-excel)/;

@ApiTags("Historico")
@Controller({path:"history"})
export class HistoricoController {
  constructor (private readonly service: HistoricoService) {}

  @Post()
  async find_all() {
    return this.service.find_all();
  }

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async upload_file(@UploadedFile(
    new ParseFilePipe({ validators: [
      new FileTypeValidator({ fileType: mimeType, fallbackToMimetype: true })
    ]})
  ) file: Express.Multer.File, @Body() data:HistoricoDto) {
    return this.service.upload_file(file, data)
  }

  @Get("get%20update%20date")
  async get_date_update() {
    return this.service.get_date_update();
  }
}
