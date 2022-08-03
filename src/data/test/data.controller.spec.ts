import { Test, TestingModule } from '@nestjs/testing';
import { DataController } from '../data.controller';
import { DataService } from '../data.service';
import ICreateDataDTO from '../dtos/ICreateDataDTO';
import IUpdateDataDTO from '../dtos/IUpdateDataDTO';
import { Data } from '../models/data.model';

describe('DataController', () => {
  let controller: DataController;

  const mockCreateDataDTO: ICreateDataDTO = {
    allocatedDisk: 5,
    allocatedRAM: 5,
    systemUptime: 'timestamp',
    totalDisk: 5,
    totalRAM: 5,
  };

  const mockUpdateDataDTO: IUpdateDataDTO = {
    id: '1',
    allocatedDisk: 5,
    allocatedRAM: 5,
    systemUptime: 'timestamp',
    totalDisk: 5,
    totalRAM: 5,
  };

  const mockData = new Data(mockCreateDataDTO);

  const mockDataList: Data[] = [mockData, mockData, mockData];

  const mockDataService = {
    create: jest.fn().mockResolvedValue(mockData),
    findAll: jest.fn().mockResolvedValue(mockDataList),
    findById: jest.fn().mockResolvedValue(mockDataList[1]),
    update: jest.fn().mockResolvedValue(mockData),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataController],
      providers: [DataService],
    })
      .overrideProvider(DataService)
      .useValue(mockDataService)
      .compile();

    controller = module.get<DataController>(DataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be able to create data', async () => {
    expect(await controller.create(mockCreateDataDTO)).toEqual(mockData);
    expect(mockDataService.create).toHaveBeenCalled();
  });

  it('should be able to find all data', async () => {
    expect(await controller.findAll()).toEqual(mockDataList);
    expect(mockDataService.findAll).toHaveBeenCalled();
  });

  it('should be able to find by id', async () => {
    expect(await controller.findById(mockData.id)).toEqual(mockDataList[1]);
    expect(mockDataService.findById).toHaveBeenCalled();
  });

  it('should be able to update data', async () => {
    expect(await controller.updateOne(mockUpdateDataDTO)).toEqual(mockData);
    expect(mockDataService.update).toHaveBeenCalled();
  });

  it('should be able to delete data', async () => {
    expect(await controller.delete(mockData.id)).toEqual(undefined);
    expect(mockDataService.delete).toHaveBeenCalled();
  });
});
