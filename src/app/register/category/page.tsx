'use client'
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import ListCategory from './list';
import HeaderPage from '@aw/components/headerPage';
import AddNewCategory from './addNew';
import FilterCategory from './filter';
import { styleModalContainer } from '@aw/utils/styleModal';
import { ICategory } from '@aw/utils/interface';
import { supabase } from '@aw/lib/database';

export default function Category() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [categories, setCategories] = useState<ICategory[]>([])

  async function getCategories() {
    const {data} = await supabase
    .from('categories')
    .select('*')
    
    if(data) {
      setCategories(data)
    }
  }
  
  function handleNew() {
    setIsAddOpen(true)
  }
  
  function handleFilter() {
    setIsFilterOpen(true)
  }

  useEffect(() => {
    getCategories()
  },[])

  return (
    <div className='flex flex-col gap-4'>
      <HeaderPage title='Cadastro de Categorias' onAddClick={handleNew} onFilterClick={handleFilter} />
      <ListCategory listCategory={categories} />
      
      <Modal
        isOpen={isAddOpen}
        ariaHideApp={false}
        contentLabel="Adicionar Novo"
        style={styleModalContainer}
      >
        <AddNewCategory loadFunction={getCategories} onclose={setIsAddOpen} />
      </Modal>
      
      <Modal
        isOpen={isFilterOpen}
        ariaHideApp={false}
        contentLabel="Filtrar Categoria"
        style={styleModalContainer}
      >
        <FilterCategory onclose={setIsFilterOpen} />
      </Modal>

    </div>
  )
}