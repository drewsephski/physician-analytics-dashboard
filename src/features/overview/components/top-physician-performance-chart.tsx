'use client';

import { physicianData } from '@/data/physician-data';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Legend,
  Rectangle,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

// Calculate morning discharge rate for each physician
const processedData = physicianData
  .map((physician) => {
    // Assuming morning is from 6 AM to 12 PM (indices 6 to 11)
    const morningDischarges = physician.discharges
      .slice(6, 12)
      .reduce((a, b) => a + b, 0);
    const totalDischarges = physician.discharges.reduce((a, b) => a + b, 0);
    const morningDischargeRate =
      totalDischarges > 0 ? (morningDischarges / totalDischarges) * 100 : 0;

    return {
      name: physician.name,
      morningDischargeRate: parseFloat(morningDischargeRate.toFixed(2))
    };
  })
  .sort((a, b) => b.morningDischargeRate - a.morningDischargeRate)
  .slice(0, 15);

// Custom legend content
const renderLegend = () => {
  return (
    <div className='flex justify-center space-x-4'>
      <div className='flex items-center'>
        <div className='mr-2 h-4 w-4 bg-green-500'></div>
        <span>Above Target</span>
      </div>
      <div className='flex items-center'>
        <div className='mr-2 h-4 w-4 bg-red-500'></div>
        <span>Below Target</span>
      </div>
    </div>
  );
};

export default function TopPhysicianPerformanceChart() {
  return (
    <div className='h-full w-full p-4'>
      <h2 className='mb-2 text-xl font-bold'>Top Physician Performance</h2>
      <p className='mb-4 text-sm text-gray-500'>
        Physicians ranked by morning discharge rate with performance indicators
      </p>
      <ResponsiveContainer width='100%' height={400}>
        <BarChart
          data={processedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 75 }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            dataKey='name'
            angle={-45}
            textAnchor='end'
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            label={{
              value: 'Morning Discharge Rate (%)',
              angle: -90,
              position: 'insideLeft'
            }}
            domain={[0, 100]}
          />
          <Tooltip />
          <Legend content={renderLegend} />
          <ReferenceLine y={60} stroke='green' strokeDasharray='3 3'>
            <Label
              value='Excellence: 60%'
              position='insideTopRight'
              className='fill-green-600 text-xs'
            />
          </ReferenceLine>
          <ReferenceLine y={40} stroke='orange' strokeDasharray='3 3'>
            <Label
              value='Target: 40%'
              position='insideTopRight'
              className='fill-orange-500 text-xs'
            />
          </ReferenceLine>
          <Bar
            dataKey='morningDischargeRate'
            fill='#d0021b'
            activeBar={<Rectangle fill='red' stroke='blue' />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
