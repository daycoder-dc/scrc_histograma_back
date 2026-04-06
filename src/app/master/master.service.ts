import { Injectable } from "@nestjs/common";
import { MasterDto } from "./master.dto";
// import { Express } from "express";
// import FormData from "form-data";
import "multer";


@Injectable()
export class MasterService {

  async load_file(file: Express.Multer.File, data:MasterDto) {
    console.log(file.originalname);
    console.log(data);
  }
}
