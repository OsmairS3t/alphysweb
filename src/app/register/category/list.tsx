'use client'
import React, { useEffect, useState } from 'react';
import { supabase } from '@aw/lib/database'; 
import { ICategory } from '@aw/utils/interface';

export default function ListCategory() {
  const [categories, setCategories] = useState<ICategory[]>([])

  async function getCategories() {
    const {data} = await supabase
    .from('categories')
    .select('*')
    
    if(data) {
      setCategories(data)
    }
  }

  useEffect(() => {
    getCategories()
  },[])

  return (
    <table className='w-full'>
      <thead className='bg-slate-800 border-b-2 border-slate-700'>
        <tr>
          <th className='p-1'>Id</th>
          <th className='p-1 text-left'>Categoria</th>
          <th className='p-1'>Opção</th>
        </tr>
      </thead>
      <tbody>
        {categories.map(cat => 
          <tr key={cat.id} className='bg-slate-950 even:bg-slate-900'>
            <td className='text-center'>1</td>
            <td>{cat.name}</td>
            <td className='text-center'>Excluir</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}