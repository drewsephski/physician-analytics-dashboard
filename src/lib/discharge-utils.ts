import {
  PhysicianData,
  ProcessedPhysicianData,
  DischargeMetrics
} from '@/types/discharge';

export function processPhysicianData(
  data: PhysicianData[]
): ProcessedPhysicianData[] {
  return data.map((phy) => {
    const total = phy.discharges.reduce((sum, val) => sum + val, 0);
    const weightedSum = phy.discharges.reduce(
      (sum, val, hour) => sum + val * (hour + 0.5),
      0
    );
    const averageDischargeTime = total > 0 ? weightedSum / total : 0;
    const peakValue = Math.max(...phy.discharges);
    const peakHour = phy.discharges.indexOf(peakValue);
    const dischargesBeforeNoon = phy.discharges
      .slice(0, 12)
      .reduce((a, b) => a + b, 0);
    const percentBeforeNoon =
      total > 0 ? (dischargesBeforeNoon / total) * 100 : 0;

    return {
      ...phy,
      total,
      averageDischargeTime,
      peakHour,
      dischargesBeforeNoon,
      percentBeforeNoon
    };
  });
}

export function calculateOverallMetrics(
  processedData: ProcessedPhysicianData[]
): DischargeMetrics {
  const totalDischarges = processedData.reduce(
    (sum, phy) => sum + phy.total,
    0
  );
  const totalWeightedSum = processedData.reduce(
    (sum, phy) => sum + phy.averageDischargeTime * phy.total,
    0
  );
  const avgDischargeTime =
    totalDischarges > 0 ? totalWeightedSum / totalDischarges : 0;
  const totalBeforeNoon = processedData.reduce(
    (sum, phy) => sum + phy.dischargesBeforeNoon,
    0
  );
  const percentBeforeNoon =
    totalDischarges > 0 ? (totalBeforeNoon / totalDischarges) * 100 : 0;

  const hourlyTotals = Array(24)
    .fill(0)
    .map((_, i) =>
      processedData.reduce((sum, phy) => sum + phy.discharges[i], 0)
    );
  const peakHour = hourlyTotals.indexOf(Math.max(...hourlyTotals));

  return {
    totalDischarges,
    avgDischargeTime,
    percentBeforeNoon,
    peakHour,
    hourlyTotals
  };
}

export function getColorScale(value: number, maxValue: number) {
  if (value === 0) return { bg: '#ffffff', text: '#6b7280' };

  const intensity = Math.sqrt(value / maxValue);
  if (intensity > 0.85) return { bg: '#0f766e', text: '#ffffff' };
  if (intensity > 0.65) return { bg: '#14b8a6', text: '#ffffff' };
  if (intensity > 0.45) return { bg: '#5eead4', text: '#1f2937' };
  if (intensity > 0.2) return { bg: '#99f6e4', text: '#1f2937' };
  return { bg: '#ccfbf1', text: '#4b5563' };
}
