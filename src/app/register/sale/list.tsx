'use client'
import React from 'react';

export default function ListSale() {
  return (
    <table className='w-full'>
      <thead className='bg-slate-800 border-b-2 border-slate-700'>
        <tr>
          <th className='p-1 text-left'>Cliente</th>
          <th className='p-1 text-left'>Produto</th>
          <th className='p-1'>Quant.</th>
          <th className='p-1 text-right'>Valor</th>
          <th className='p-1'>Opção</th>
        </tr>
      </thead>
      <tbody>
        <tr className='bg-slate-950 even:bg-slate-900'>
          <td>Maria</td>
          <td>Bombom</td>
          <td className='text-center'>2</td>
          <td className='text-right'>R$ 10,00</td>
          <td className='text-center'>Excluir</td>
        </tr>
      </tbody>
    </table>
  )
}