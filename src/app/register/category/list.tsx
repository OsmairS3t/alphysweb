'use client'
import React, { Suspense, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { FiEdit, FiTrash2 } from 'react-icons/fi'
import { ICategory } from '@aw/utils/interface';
import Link from 'next/link';
import { supabase } from '@aw/lib/database';
import HeaderPage from '@aw/components/headerPage';
import { styleModalContainer } from '@aw/utils/styleModal';
import AddNewCategory from './addNew';
import FilterCategory from './filter';

export default function ListCategory() {
  const [idCategory, setIdCategory] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [categories, setCategories] = useState<ICategory[]>([])
  
  function handleNew() {
    setIdCategory('')
    setIsAddOpen(true)
  }
  
  function handleEdit(id: string) {
    setIdCategory(id)
    setIsAddOpen(true)
  }
  
  function handleFilter() {
    setIdCategory('')
    setIsFilterOpen(true)
  }

  async function getCategories() {
    const {data} = await supabase.from('categories').select('*')
    if(data) {
      setCategories(data)
    }
  }

  async function handleDelete(id: string) {
    try {
      await supabase.from('categories').delete().eq('id', id)
      getCategories()
      alert('Categoria excluida com sucesso!')
    } catch (error) {
      console.log(error)      
    }
  }
 
  useEffect(() => {
    getCategories()
  },[])

  return (
    <>
      <HeaderPage title='Cadastro de Categorias' onAddClick={handleNew} onFilterClick={handleFilter} />
      <table className='w-full'>
        <thead className='bg-slate-800 border-b-2 border-slate-700'>
          <tr>
            <th className='p-1 w-1/6'>Id</th>
            <th className='p-1 text-left'>Categoria</th>
            <th className='p-1 w-1/4'>Opção</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => 
            <tr key={cat.id} className='bg-slate-950 even:bg-slate-900'>
              <td className='text-center'>{cat.id}</td>
              <td>{cat.name}</td>
              <td className='flex flex-row justify-center items-center gap-4'>
                <button onClick={() => handleEdit(cat.id)}><FiEdit size={20} /></button>
                <button onClick={() => handleDelete(cat.id)}><FiTrash2 size={20} /></button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal
        isOpen={isAddOpen}
        ariaHideApp={false}
        contentLabel="Adicionar Novo"
        style={styleModalContainer}
      >
        <AddNewCategory loadFunction={getCategories} onclose={setIsAddOpen} idcategory={idCategory} />
      </Modal>

      <Modal
        isOpen={isFilterOpen}
        ariaHideApp={false}
        contentLabel="Filtrar Categoria"
        style={styleModalContainer}
      >
        <FilterCategory onclose={setIsFilterOpen} />
      </Modal>
    </>
  )
}