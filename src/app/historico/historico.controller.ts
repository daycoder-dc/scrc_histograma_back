import {
  Body, Controller, FileTypeValidator, Get, Header, ParseFilePipe,
  Post, Res, UploadedFile, UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { HistoricoService } from "./historico.service";
import { HistoricoDto } from "./historico.dto";
import { ApiTags } from "@nestjs/swagger";
import type { Express, Response } from "express";
import "multer";

const mimeType = /(application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|application\/vnd\.ms-excel)/;

@ApiTags("Historico")
@Controller({ path: "history" })
export class HistoricoController {
  constructor(private readonly service: HistoricoService) { }

  @Get()
  find_all(@Res() res: Response) {
    this.service.find_all(res);
  }

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  upload_file(@UploadedFile(new ParseFilePipe({ validators: [new FileTypeValidator({ fileType: mimeType, fallbackToMimetype: true })] })) file: Express.Multer.File, @Body() data: HistoricoDto) {
    return this.service.upload_file(file, data)
  }

  @Get("get%20update%20date")
  get_date_update() {
    return this.service.get_date_update();
  }
}
