'use client'
import React, { useState } from 'react';
import Modal from 'react-modal';
import ListCategory from './list';
import HeaderPage from '@aw/components/headerPage';
import AddNewCategory from './addNew';
import FilterCategory from './filter';

export default function Category() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  function handleNew() {
    setIsAddOpen(true)
  }
  
  function handleFilter() {
    setIsFilterOpen(true)
  }

  return (
    <div className='flex flex-col gap-4'>
      <HeaderPage title='Cadastro de Categorias' onAddClick={handleNew} onFilterClick={handleFilter} />
      <ListCategory />
      
      <Modal
        isOpen={isAddOpen}
        ariaHideApp={false}
        contentLabel="Adicionar Novo"
      >
        <AddNewCategory onclose={setIsAddOpen} />
      </Modal>
      
      <Modal
        isOpen={isFilterOpen}
        ariaHideApp={false}
        contentLabel="Filtrar Categoria"
      >
        <FilterCategory onclose={setIsFilterOpen} />
      </Modal>

    </div>
  )
}