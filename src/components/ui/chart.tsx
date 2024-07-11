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
        <Bar dataKey="compras" fill="#ec7e00" activeBar={<Rectangle fill="orange" stroke="white" />} />
        <Bar dataKey="vendas" fill="#16d45f" activeBar={<Rectangle fill="green" stroke="white" />} />
        <Bar dataKey="saldo" fill="#630ea8" activeBar={<Rectangle fill="purple" stroke="white" />} />
      </BarChart>
    </ResponsiveContainer>
  )
}