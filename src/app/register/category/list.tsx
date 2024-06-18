'use client'
import React from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi'
import { ICategory } from '@aw/utils/interface';
import Link from 'next/link';
import AddNewCategory from './addNew';
import { supabase } from '@aw/lib/database';

interface Props {
  listCategory: ICategory[]
}

export default function ListCategory({ listCategory }:Props) {

  async function handleDelete(id: string) {
    try {
      await supabase.from('categories').delete().eq('id', id)
      alert('Categoria excluida com sucesso!')
    } catch (error) {
      console.log(error)      
    }
  }

  return (
    <table className='w-full'>
      <thead className='bg-slate-800 border-b-2 border-slate-700'>
        <tr>
          <th className='p-1 w-1/6'>Id</th>
          <th className='p-1 text-left'>Categoria</th>
          <th className='p-1 w-1/4'>Opção</th>
        </tr>
      </thead>
      <tbody>
        {listCategory.map(cat => 
          <tr key={cat.id} className='bg-slate-950 even:bg-slate-900'>
            <td className='text-center'>{cat.id}</td>
            <td>{cat.name}</td>
            <td className='flex flex-row justify-center items-center gap-4'>
              <Link href="/register/category"><FiEdit size={20} /></Link>
              <button onClick={() => handleDelete(cat.id)}><FiTrash2 size={20} /></button>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}