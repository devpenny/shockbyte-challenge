import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { DataEntity } from '../typeorm/entities/data.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataAccessAdapter } from './data.DataAccessAdapter';
import { JwtStrategy } from '../auth/jwt.strategy';
import { PruneService } from './prune/prune.service';

@Module({
  imports: [TypeOrmModule.forFeature([DataEntity])],
  providers: [DataService, DataAccessAdapter, JwtStrategy, PruneService],
  controllers: [DataController],
})
export class DataModule {}
