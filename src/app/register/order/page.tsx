'use client'
import React, { useState } from 'react';
import Modal from 'react-modal';
import ListOrder from './list';
import HeaderPage from '@aw/components/headerPage';
import AddNewOrder from './addNew';
import FilterOrder from './filter';
import { styleModalContainer } from '@aw/utils/styleModal';

export default function Order() {
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
      <HeaderPage title='Cadastro de Encomendas' onAddClick={handleNew} onFilterClick={handleFilter} />
      <ListOrder />
      
      <Modal
        isOpen={isAddOpen}
        ariaHideApp={false}
        contentLabel="Adicionar Novo"
        style={styleModalContainer}
      >
        <AddNewOrder onclose={setIsAddOpen} />
      </Modal>
      
      <Modal
        isOpen={isFilterOpen}
        ariaHideApp={false}
        contentLabel="Filtrar Encomenda"
        style={styleModalContainer}
      >
        <FilterOrder onclose={setIsFilterOpen} />
      </Modal>

    </div>
  )
}