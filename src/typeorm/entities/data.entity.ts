import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'statistic_data' })
export class DataEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id: string;

  @Column({ name: 'system_uptime', type: 'timestamp' })
  systemUptime: string;

  @Column({ name: 'total_RAM', type: 'bigint' })
  totalRAM: number;

  @Column({ name: 'allocated_RAM', type: 'bigint' })
  allocatedRAM: number;

  @Column({ name: 'total_disk', type: 'bigint' })
  totalDisk: number;

  @Column({ name: 'allocated_disk', type: 'bigint' })
  allocatedDisk: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
