'use client'
import React, { useState } from 'react';
import Modal from 'react-modal';
import ListUser from './list';
import HeaderPage from '@aw/components/headerPage';
import AddNewUser from './addNew';
import FilterUser from './filter';
import { styleModalContainer } from '@aw/utils/styleModal';

export default function User() {
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
      <HeaderPage title='Cadastro de Usuarios' onAddClick={handleNew} onFilterClick={handleFilter} />
      <ListUser />
      
      <Modal
        isOpen={isAddOpen}
        ariaHideApp={false}
        contentLabel="Adicionar Novo"
        style={styleModalContainer}
      >
        <AddNewUser onclose={setIsAddOpen} />
      </Modal>
      
      <Modal
        isOpen={isFilterOpen}
        ariaHideApp={false}
        contentLabel="Filtrar Categoria"
        style={styleModalContainer}
      >
        <FilterUser onclose={setIsFilterOpen} />
      </Modal>

    </div>
  )
}