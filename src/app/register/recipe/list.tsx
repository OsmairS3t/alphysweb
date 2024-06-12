'use client'
import React from 'react';

export default function ListRecipe() {
  return (
    <table className='w-full'>
      <thead className='bg-slate-800 border-b-2 border-slate-700'>
        <tr>
          <th className='p-1 text-left'>Nome do produto</th>
          <th className='p-1 text-left'>Preparo</th>
          <th className='p-1 text-left'>Cozimento</th>
          <th className='p-1'>Opção</th>
        </tr>
      </thead>
      <tbody>
        <tr className='bg-slate-950 even:bg-slate-900'>
          <td>Pão</td>
          <td>Mistura e ja era</td>
          <td>Poe pra assar</td>
          <td className='text-center'>Detalhes</td>
          <td className='text-center'>Excluir</td>
        </tr>
      </tbody>
    </table>
  )
}