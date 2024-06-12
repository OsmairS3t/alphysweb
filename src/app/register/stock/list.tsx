'use client'
import React from 'react';

export default function ListStock() {
  return (
    <table className='w-full'>
      <thead className='bg-slate-800 border-b-2 border-slate-700'>
        <tr>
          <th className='p-1 text-left'>Produto</th>
          <th className='p-1'>Quant.</th>
          <th className='p-1'>Opção</th>
        </tr>
      </thead>
      <tbody>
        <tr className='bg-slate-950 even:bg-slate-900'>
          <td>Bombom</td>
          <td className='text-center'>1</td>
          <td className='text-center'>Excluir</td>
        </tr>
        <tr className='bg-slate-950 even:bg-slate-900'>
          <td>Cápsula</td>
          <td className='text-center'>2</td>
          <td className='text-center'>Excluir</td>
        </tr>
        <tr className='bg-slate-950 even:bg-slate-900'>
          <td>Pão</td>
          <td className='text-center'>3</td>
          <td className='text-center'>Excluir</td>
        </tr>
      </tbody>
    </table>
  )
}