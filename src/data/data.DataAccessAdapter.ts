import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataEntity } from '../typeorm/entities/data.entity';
import { Repository, UpdateResult } from 'typeorm';
import IDataRepository from './interfaces/IDataRepository';
import { Data } from './models/data.model';
import IPaginationDTO from './dtos/IPaginationDTO';

@Injectable()
export class DataAccessAdapter implements IDataRepository {
  constructor(
    @InjectRepository(DataEntity)
    private readonly dataRepository: Repository<DataEntity>,
  ) {}

  async create(data: Data): Promise<Data> {
    const savedData = await this.dataRepository.save(data);

    return this.dataFromEntity(savedData);
  }

  async findAll(paginationConfig: IPaginationDTO): Promise<Data[]> {
    const foundDataEntities = await this.dataRepository
      .createQueryBuilder('data')
      .orderBy('data.created_at', 'ASC')
      .skip(paginationConfig.page * paginationConfig.limit)
      .take(paginationConfig.limit)
      .getMany();

    const foundData = foundDataEntities.map((dataEntity) => {
      return this.dataFromEntity(dataEntity);
    });

    return foundData;
  }

  async findById(id: string): Promise<Data | undefined> {
    const foundData = await this.dataRepository.findOne({ where: { id } });

    if (!foundData) return 
    
    return this.dataFromEntity(foundData);
  }

  async update(data: Data): Promise<Data> {
    const dataToUpdate = await this.dataRepository
      .createQueryBuilder()
      .update(data)
      .where({
        id: data.id,
      })
      .returning('*')
      .execute();

      return this.dataFromUpdateResult(dataToUpdate);
  }

  async delete(id: string) {
    await this.dataRepository.delete(id);
  }

  dataFromEntity(dataEntity: DataEntity): Data {
    return new Data({
      systemUptime: dataEntity.systemUptime,
      totalRAM: dataEntity.totalRAM,
      allocatedRAM: dataEntity.allocatedRAM,
      totalDisk: dataEntity.totalDisk,
      allocatedDisk: dataEntity.allocatedDisk,
      id: dataEntity.id,
    });
  }

  dataFromUpdateResult(dataEntity: UpdateResult): Data {
    return new Data({
      id: dataEntity.raw[0].id,
      systemUptime: dataEntity.raw[0].system_uptime,
      totalRAM: dataEntity.raw[0].total_RAM,
      allocatedRAM: dataEntity.raw[0].allocated_RAM,
      totalDisk: dataEntity.raw[0].total_disk,
      allocatedDisk: dataEntity.raw[0].allocated_disk,
    });
  }
}
