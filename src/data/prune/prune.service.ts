import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { DataEntity } from '../../typeorm/entities/data.entity';
import { Repository } from 'typeorm';
import { randomInt } from 'crypto';

@Injectable()
export class PruneService {
  constructor(
    @InjectRepository(DataEntity)
    private readonly dataRepository: Repository<DataEntity>,
  ) {}

  dataEntityFactory() {
    const dataEntity = new DataEntity();
    dataEntity.allocatedDisk = randomInt(100);
    dataEntity.allocatedRAM = randomInt(100);
    dataEntity.totalDisk = randomInt(100);
    dataEntity.totalRAM = randomInt(100);
    dataEntity.systemUptime = new Date().toISOString();

    return dataEntity;
  }

  //////// Proof of concept for the pruning -> storing dummy data each second/////////
  // @Cron('* * * * * *')
  // createDummyDataPOC() {
  //   this.dataRepository.save(this.dataEntityFactory());
  // }

  // @Cron('0 * * * * *')
  // async prunePOC() {
  //   await this.dataRepository
  //     .createQueryBuilder()
  //     .delete()
  //     .from(DataEntity)
  //     .where(
  //       'extract(epoch from now()) - extract(epoch from created_at) > 60 AND round(extract(second from created_at)) <> 0',
  //     )
  //     .execute();
  // }

  //////////////  Real Cron for the application //////////////
  @Cron('* 0 * * * *')
  async pruneDataOlderThan24hrs() {
    await this.dataRepository
      .createQueryBuilder()
      .delete()
      .from(DataEntity)
      .where(
        'extract(epoch from now()) - extract(epoch from created_at) > 86400 AND round(extract(minute from created_at)) <> 0',
      )
      .execute();
  }
}
