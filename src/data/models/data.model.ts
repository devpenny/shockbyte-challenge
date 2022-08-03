export class Data {
  systemUptime: string;
  totalRAM: number;
  allocatedRAM: number;
  totalDisk: number;
  allocatedDisk: number;
  id?: string;

  constructor({
    systemUptime,
    totalRAM,
    allocatedRAM,
    totalDisk,
    allocatedDisk,
    id = null,
  }) {
    this.systemUptime = systemUptime;
    this.totalRAM = totalRAM;
    this.allocatedRAM = allocatedRAM;
    this.totalDisk = totalDisk;
    this.allocatedDisk = allocatedDisk;
    this.id = id;
  }
}
