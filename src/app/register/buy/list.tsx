'use client'
import React from 'react';

export default function ListBuy() {
  return (
    <table className='w-full'>
      <thead className='bg-slate-800 border-b-2 border-slate-700'>
        <tr>
          <th className='p-1 text-left'>Tipo</th>
          <th className='p-1 text-left'>Produto</th>
          <th className='p-1 text-left'>Local</th>
          <th className='p-1 text-left'>Quant.</th>
          <th className='p-1 text-left'>Valor</th>
          <th className='p-1 text-center'>Opção</th>
        </tr>
      </thead>
      <tbody>
        <tr className='bg-slate-950 even:bg-slate-900'>
          <td>Chocolate</td>
          <td>Meio amargo</td>
          <td>Venda da esquina</td>
          <td>1 kg</td>
          <td>R$ 27,00</td>
          <td className='text-center'>Excluir</td>
        </tr>
      </tbody>
    </table>
  )
}