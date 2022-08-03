import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataAccessAdapter } from '../data.DataAccessAdapter';
import { DataService } from '../data.service';
import IPaginationDTO from '../dtos/IPaginationDTO';
import { Data } from '../models/data.model';

describe('DataService', () => {
  let service: DataService;

  const mockPagination: IPaginationDTO = {
    page: 1,
    limit: 15,
  };

  const mockData = new Data({
    id: '1',
    allocatedDisk: 5,
    allocatedRAM: 5,
    systemUptime: 'timestamp',
    totalDisk: 5,
    totalRAM: 5,
  });

  const mockDataList = [mockData, mockData, mockData];

  const mockDataAccessAdapter = {
    create: jest.fn().mockResolvedValue(mockData),
    findAll: jest.fn().mockResolvedValue(mockDataList),
    findById: jest.fn().mockResolvedValue(mockDataList[1]),
    update: jest.fn().mockResolvedValue(mockData),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataService, DataAccessAdapter],
    })
      .overrideProvider(DataAccessAdapter)
      .useValue(mockDataAccessAdapter)
      .compile();

    service = module.get<DataService>(DataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to create data', async () => {
    expect(await service.create(mockData)).toEqual(mockData);
    expect(mockDataAccessAdapter.create).toHaveBeenCalled();
  });

  it('should be able to find all data', async () => {
    expect(await service.findAll(mockPagination)).toEqual(mockDataList);
    expect(mockDataAccessAdapter.findAll).toHaveBeenCalled();
  });

  it('should be able to find by id', async () => {
    expect(await service.findById(mockData.id)).toEqual(mockData);
    expect(mockDataAccessAdapter.findById).toHaveBeenCalled();
  });

  it('should be able to throw NotFoundException when finding by Id', async () => {
    jest
      .spyOn(mockDataAccessAdapter, 'findById')
      .mockResolvedValueOnce(undefined);

    await expect(service.findById(mockData.id)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should be able to update', async () => {
    expect(await service.update(mockData)).toEqual(mockData);
    expect(mockDataAccessAdapter.update).toHaveBeenCalled();
  });

  it('should be able to throw NotFoundException when updating', async () => {
    jest
      .spyOn(mockDataAccessAdapter, 'findById')
      .mockResolvedValueOnce(undefined);

    await expect(service.update(mockData)).rejects.toThrow(NotFoundException);
  });

  it('should be able to delete', async () => {
    expect(await service.delete(mockData.id)).toBeUndefined();
    expect(mockDataAccessAdapter.delete).toHaveBeenCalled();
  });

  it('should be able to throw NotFoundException when deleting', async () => {
    jest
      .spyOn(mockDataAccessAdapter, 'findById')
      .mockResolvedValueOnce(undefined);

    await expect(service.delete(mockData.id)).rejects.toThrow(
      NotFoundException,
    );
  });
});
