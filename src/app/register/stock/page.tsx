'use client'
import React, { useState } from 'react';
import Modal from 'react-modal';
import ListStock from './list';
import HeaderPage from '@aw/components/headerPage';
import AddNewStock from './addNew';
import FilterStock from './filter';
import { styleModalContainer } from '@aw/utils/styleModal';

export default function Stock() {
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
      <HeaderPage title='Cadastro de Estoques de Produtos' onAddClick={handleNew} onFilterClick={handleFilter} />
      <ListStock />
      
      <Modal
        isOpen={isAddOpen}
        ariaHideApp={false}
        contentLabel="Adicionar Novo"
        style={styleModalContainer}
      >
        <AddNewStock onclose={setIsAddOpen} />
      </Modal>
      
      <Modal
        isOpen={isFilterOpen}
        ariaHideApp={false}
        contentLabel="Filtrar Produto"
        style={styleModalContainer}
      >
        <FilterStock onclose={setIsFilterOpen} />
      </Modal>

    </div>
  )
}