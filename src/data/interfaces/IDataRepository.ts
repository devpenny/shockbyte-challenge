import IPaginationDTO from '../dtos/IPaginationDTO';
import { Data } from '../models/data.model';

export default interface IDataRepository {
  create(data: Data): Promise<Data>;
  findAll(paginationConfig: IPaginationDTO): Promise<Data[]>;
  findById(id: string): Promise<Data>;
  update(data: Data): Promise<Data>;
  delete(id: string);
}
