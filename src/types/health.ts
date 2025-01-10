export interface BBTData {
  date: Date;
  temperature: number;
  time: string;
  notes?: string;
}

export interface MucusData {
  date: Date;
  type: 'dry' | 'sticky' | 'creamy' | 'watery' | 'egg-white';
  notes?: string;
}

export interface CycleData {
  startDate: Date;
  endDate: Date;
  symptoms: string[];
  bbtData: BBTData[];
  mucusData: MucusData[];
  notes: string;
}