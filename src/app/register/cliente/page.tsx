'use client'
import React, { useState } from 'react';
import Modal from 'react-modal';
import ListClient from './list';
import HeaderPage from '@aw/components/headerPage';
import AddNewClient from './addNew';
import FilterClient from './filter';
import { styleModalContainer } from '@aw/utils/styleModal';

export default function Cliente() {
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
      <HeaderPage title='Cadastro de Clientes' onAddClick={handleNew} onFilterClick={handleFilter} />
      <ListClient />
      
      <Modal
        isOpen={isAddOpen}
        ariaHideApp={false}
        contentLabel="Adicionar Novo"
        style={styleModalContainer}
      >
        <AddNewClient onclose={setIsAddOpen} />
      </Modal>
      
      <Modal
        isOpen={isFilterOpen}
        ariaHideApp={false}
        contentLabel="Filtrar Cliente"
        style={styleModalContainer}
      >
        <FilterClient onclose={setIsFilterOpen} />
      </Modal>

    </div>
  )
}