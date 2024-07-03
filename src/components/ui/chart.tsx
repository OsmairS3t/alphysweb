'use client'

import React from 'react';
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface Props {
  name: string;
  compras: number;
  vendas: number;
  saldo: number;
}
interface PropsChart {
  data: Props[]
}

export default function Chart({ data }: PropsChart) {

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="compras" fill="#d8b184" activeBar={<Rectangle fill="pink" stroke="blue" />} />
        <Bar dataKey="vendas" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
        <Bar dataKey="saldo" fill="#82bfca" activeBar={<Rectangle fill="gold" stroke="purple" />} />
      </BarChart>
    </ResponsiveContainer>
  )
}