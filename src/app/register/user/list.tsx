'use client'
import React from 'react';

export default function ListUser() {
  return (
    <table className='w-full'>
      <thead className='bg-slate-800 border-b-2 border-slate-700'>
        <tr>
          <th className='p-1 text-left'>Nome</th>
          <th className='p-1 text-left'>E-mail</th>
          <th className='p-1'>Opção</th>
        </tr>
      </thead>
      <tbody>
        <tr className='bg-slate-950 even:bg-slate-900'>
          <td>Jose</td>
          <td>jose@araujo.com</td>
          <td className='text-center'>Excluir</td>
        </tr>
      </tbody>
    </table>
  )
}