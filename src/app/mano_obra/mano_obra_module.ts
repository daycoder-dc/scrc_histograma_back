import { ManoObraController } from "./mano_obra_controller";
import { ManoObraService } from "./mano_obra_service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
  controllers: [ManoObraController],
  providers: [ManoObraService],
  imports: [TypeOrmModule.forFeature()]
})
export class ManoObraModule {}
