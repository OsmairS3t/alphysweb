'use client'
import React, { useState } from 'react';
import Modal from 'react-modal';
import ListRecipe from './list';
import HeaderPage from '@aw/components/headerPage';
import AddNewRecipe from './addNew';
import FilterRecipe from './filter';
import { styleModalContainer } from '@aw/utils/styleModal';

export default function Recipe() {
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
      <HeaderPage title='Cadastro de Receitas' onAddClick={handleNew} onFilterClick={handleFilter} />
      <ListRecipe />
      
      <Modal
        isOpen={isAddOpen}
        ariaHideApp={false}
        contentLabel="Adicionar Nova"
        style={styleModalContainer}
      >
        <AddNewRecipe onclose={setIsAddOpen} />
      </Modal>
      
      <Modal
        isOpen={isFilterOpen}
        ariaHideApp={false}
        contentLabel="Filtrar Receita"
        style={styleModalContainer}
      >
        <FilterRecipe onclose={setIsFilterOpen} />
      </Modal>

    </div>
  )
}