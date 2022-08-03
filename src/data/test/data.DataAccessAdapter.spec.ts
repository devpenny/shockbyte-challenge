import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateResult } from 'typeorm';
import { DataEntity } from '../../typeorm/entities/data.entity';
import { DataAccessAdapter } from '../data.DataAccessAdapter';
import IPaginationDTO from '../dtos/IPaginationDTO';
import { Data } from '../models/data.model';

describe('DataAccessAdapter', () => {
  let adapter: DataAccessAdapter;

  const mockPagination: IPaginationDTO = {
    page: 1,
    limit: 15,
  };

  const mockDataSave = new Data({
    allocatedDisk: 5,
    allocatedRAM: 5,
    systemUptime: 'timestamp',
    totalDisk: 5,
    totalRAM: 5,
  });

  const mockDataUpdate = new Data({
    ...mockDataSave,
    id: '1',
  });

  const mockDataEntity = new DataEntity();
  mockDataEntity.id = '1';
  mockDataEntity.allocatedDisk = 5;
  mockDataEntity.allocatedRAM = 5;
  mockDataEntity.systemUptime = 'timestamp';
  mockDataEntity.totalRAM = 5;
  mockDataEntity.totalDisk = 5;

  const mockDataEntityUpdate = new UpdateResult();
  mockDataEntityUpdate.raw = [
    {
      id: mockDataEntity.id,
      system_uptime: mockDataEntity.systemUptime,
      total_RAM: mockDataEntity.totalRAM,
      allocated_RAM: mockDataEntity.allocatedRAM,
      total_disk: mockDataEntity.totalDisk,
      allocated_disk: mockDataEntity.allocatedDisk,
    },
  ];

  const mockDataEntityList = [mockDataEntity, mockDataEntity, mockDataEntity];

  const mockDataRepository = {
    save: jest.fn().mockImplementation(
      (data: DataEntity): Promise<DataEntity> =>
        Promise.resolve({
          ...data,
          id: '1',
        }),
    ),
    find: jest.fn().mockResolvedValue(mockDataEntityList),
    findOne: jest.fn().mockResolvedValue(mockDataEntity),
    delete: jest.fn().mockResolvedValue(undefined),
    createQueryBuilder: jest.fn(() => ({
      orderBy: jest.fn(() => ({
        skip: jest.fn(() => ({
          take: jest.fn(() => ({
            getMany: jest.fn().mockResolvedValue(mockDataEntityList),
          })),
        })),
      })),
      update: jest.fn(() => ({
        where: jest.fn(() => ({
          returning: jest.fn(() => ({
            execute: jest.fn().mockResolvedValue(mockDataEntityUpdate),
          })),
        })),
      })),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataAccessAdapter,
        {
          provide: getRepositoryToken(DataEntity),
          useValue: mockDataRepository,
        },
      ],
    }).compile();

    adapter = module.get<DataAccessAdapter>(DataAccessAdapter);
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  it('should be able to save data and return that', async () => {
    expect(await adapter.create(mockDataSave)).toHaveProperty('id');
    expect(mockDataRepository.save).toHaveBeenCalled();
  });

  it('should be able to find all data and return that', async () => {
    const foundData = await adapter.findAll(mockPagination);

    expect(foundData).toBeInstanceOf(Array);
    if (foundData) expect(foundData[0]).toBeInstanceOf(Data);

    expect(mockDataRepository.find).toHaveBeenCalled;
  });

  it('should be able to find a specific data given an id and return that', async () => {
    const foundData = await adapter.findById(mockDataEntity.id);

    expect(foundData).toBeInstanceOf(Data);
    expect(foundData).toMatchObject({ id: mockDataEntity.id });

    expect(mockDataRepository.findOne).toHaveBeenCalled();
  });

  it('should be able to update a data and return that', async () => {
    expect(await adapter.update(mockDataUpdate)).toEqual(mockDataUpdate);
    expect(mockDataRepository.createQueryBuilder).toHaveBeenCalled;
  });

  it('should be able to delete a data and return that', async () => {
    expect(await adapter.delete(mockDataUpdate.id)).toEqual(undefined);
    expect(mockDataRepository.delete).toHaveBeenCalled();
  });
});
