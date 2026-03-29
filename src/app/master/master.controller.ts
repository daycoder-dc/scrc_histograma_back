import { Body, Controller, FileTypeValidator, ParseFilePipe,
  Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { MasterService } from "./master.service";
import { ApiTags } from "@nestjs/swagger";
import { MasterDto } from "./master.dto";

const mimeType = /(application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|application\/vnd\.ms-excel)/;

@ApiTags("Maestro")
@Controller({path: "master"})
export class MasterController {
  constructor (private readonly service: MasterService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async load_file(@UploadedFile(
    new ParseFilePipe({validators: [
      new FileTypeValidator({ fileType: mimeType, fallbackToMimetype: true })
    ]})
  ) file: Express.Multer.File, @Body() data:MasterDto) {
    return this.service.load_file(file, data);
  }
}
