'use client'
import React from 'react';

export default function ListOrder() {
  return (
    <table className='w-full'>
      <thead className='bg-slate-800 border-b-2 border-slate-700'>
        <tr>
          <th className='p-1 text-left'>Cliente</th>
          <th className='p-1 text-left'>Produto</th>
          <th className='p-1 text-center'>Quant.</th>
          <th className='p-1 text-right'>Preço</th>
          <th className='p-1' colSpan={2}>Opção</th>
        </tr>
      </thead>
      <tbody>
        <tr className='bg-slate-950 even:bg-slate-900'>
          <td>Jose</td>
          <td>Bombom - coco</td>
          <td className='text-center'>50</td>
          <td className='text-right'>R$ 250,00</td>
          <td className='text-center'>Detalhes</td>
          <td className='text-center'>Excluir</td>
        </tr>
      </tbody>
    </table>
  )
}