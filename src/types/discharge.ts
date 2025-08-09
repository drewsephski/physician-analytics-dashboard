export interface PhysicianData {
  name: string;
  discharges: number[]; // 24-hour array
  total?: number;
  averageDischargeTime?: number;
  peakHour?: number;
  dischargesBeforeNoon?: number;
  percentBeforeNoon?: number;
}

export interface ProcessedPhysicianData extends Required<PhysicianData> {}

export interface DischargeMetrics {
  totalDischarges: number;
  avgDischargeTime: number;
  percentBeforeNoon: number;
  peakHour: number;
  hourlyTotals: number[];
}
