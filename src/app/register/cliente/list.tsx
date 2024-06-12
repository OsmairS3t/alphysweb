'use client'
import React from 'react';

export default function ListClient() {
  return (
    <table className='w-full'>
      <thead className='bg-slate-800 border-b-2 border-slate-700'>
        <tr>
          <th className='p-1'>Id</th>
          <th className='p-1 text-left'>Nome</th>
          <th className='p-1'>Opção</th>
        </tr>
      </thead>
      <tbody>
        <tr className='bg-slate-950 even:bg-slate-900'>
          <td className='text-center'>1</td>
          <td>Jose</td>
          <td className='text-center'>Excluir</td>
        </tr>
        <tr className='bg-slate-950 even:bg-slate-900'>
          <td className='text-center'>2</td>
          <td>Maria</td>
          <td className='text-center'>Excluir</td>
        </tr>
        <tr className='bg-slate-950 even:bg-slate-900'>
          <td className='text-center'>3</td>
          <td>Jesus</td>
          <td className='text-center'>Excluir</td>
        </tr>
      </tbody>
    </table>
  )
}