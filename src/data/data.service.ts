import { Injectable, NotFoundException } from '@nestjs/common';
import { Data } from './models/data.model';
import { DataAccessAdapter } from './data.DataAccessAdapter';
import IPaginationDTO from './dtos/IPaginationDTO';

@Injectable()
export class DataService {
  constructor(private readonly dataAccessAdapter: DataAccessAdapter) {}

  async create(data: Data): Promise<Data> {
    return await this.dataAccessAdapter.create(data);
  }

  async findAll(paginationConfig: IPaginationDTO): Promise<Data[]> {
    return await this.dataAccessAdapter.findAll(paginationConfig);
  }

  async findById(id: string): Promise<Data> {
    const foundData = await this.dataAccessAdapter.findById(id);

    if (!foundData) throw new NotFoundException(`Data not found with id ${id}`);

    return foundData;
  }

  async update(data: Data): Promise<Data> {
    const foundData = await this.dataAccessAdapter.findById(data.id);

    if (!foundData) throw new NotFoundException(`Data not found with id ${id}`);

    return await this.dataAccessAdapter.update(data);
  }

  async delete(id: string) {
    const foundData = await this.dataAccessAdapter.findById(id);

    if (!foundData) throw new NotFoundException(`Data not found with id ${id}`);

    return await this.dataAccessAdapter.delete(id);
  }
}
