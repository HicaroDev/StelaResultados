'use client';

import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

interface Props {
  data?: any[];
}

const defaultData = [
  { name: 'Jan', value: 130 },
  { name: 'Fev', value: 110 },
  { name: 'Mar', value: 120 },
  { name: 'Abr', value: 160 },
  { name: 'Mai', value: 140 },
  { name: 'Jun', value: 180 },
];

export default function FinancialChart({ data = defaultData }: Props) {
  return (
    <div className="w-full h-full min-h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1A1A1A" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#1A1A1A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F1F1" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 700 }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 700 }}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '20px', 
              border: '1px solid #F1F1F1', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
              fontSize: '12px',
              fontWeight: 'black',
              padding: '12px 16px'
            }}
            cursor={{ stroke: '#1A1A1A', strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#1A1A1A" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#chartGradient)" 
            animationDuration={2000}
            activeDot={{ r: 6, strokeWidth: 0, fill: '#1A1A1A' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
