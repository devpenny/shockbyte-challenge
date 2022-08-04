import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Put,
  Delete,
  HttpCode,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { DataService } from './data.service';
import ICreateDataDTO from './dtos/ICreateDataDTO';
import IPaginationDTO from './dtos/IPaginationDTO';
import IUpdateDataDTO from './dtos/IUpdateDataDTO';
import { Data } from './models/data.model';

@UseGuards(JwtAuthGuard)
@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Post()
  async create(@Body() createDto: ICreateDataDTO): Promise<Data> {
    const dataToCreate = this.dataFromCreate(createDto);

    const createdData = await this.dataService.create(dataToCreate);
    return { ...createdData };
  }

  @Get()
  async findAll(
    @Query('page') page,
    @Query('limit') limit,
  ): Promise<Data[]> {
    const paginationConfig: IPaginationDTO = {
      page = 0,
      limit = 10,
    };
    const foundData = await this.dataService.findAll(paginationConfig);

    return [...foundData];
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Data> {
    const foundData = await this.dataService.findById(id);
    return { ...foundData };
  }

  @Put()
  async updateOne(@Body() updateDto: IUpdateDataDTO): Promise<Data> {
    const dataToUpdate = this.dataFromUpdate(updateDto);

    const updatedData = await this.dataService.update(dataToUpdate);
    return { ...updatedData };
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    await this.dataService.delete(id);
  }

  dataFromCreate(dtoCreate: ICreateDataDTO): Data {
    return new Data({
      systemUptime: dtoCreate.systemUptime,
      allocatedDisk: dtoCreate.allocatedDisk,
      allocatedRAM: dtoCreate.allocatedRAM,
      totalDisk: dtoCreate.totalDisk,
      totalRAM: dtoCreate.totalRAM,
    });
  }

  dataFromUpdate(dtoUpdate: IUpdateDataDTO): Data {
    return new Data({
      id: dtoUpdate.id,
      systemUptime: dtoUpdate.systemUptime,
      allocatedDisk: dtoUpdate.allocatedDisk,
      allocatedRAM: dtoUpdate.allocatedRAM,
      totalDisk: dtoUpdate.totalDisk,
      totalRAM: dtoUpdate.totalRAM,
    });
  }
}
