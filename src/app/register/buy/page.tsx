'use client'
import React, { useState } from 'react';
import Modal from 'react-modal'

import HeaderPage from '@aw/components/headerPage';
import ListBuy from './list';
import AddNewBuy from './addNew';
import FilterBuy from './filter';

export default function Buy() {
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
      <HeaderPage title='Cadastro de Compras' onAddClick={handleNew} onFilterClick={handleFilter} />
      <ListBuy />
      
      <Modal
        isOpen={isAddOpen}
        ariaHideApp={false}
        contentLabel="Adicionar Nova"
      >
        <AddNewBuy onclose={setIsAddOpen} />
      </Modal>
      
      <Modal
        isOpen={isFilterOpen}
        ariaHideApp={false}
        contentLabel="Filtrar Compra"
      >
        <FilterBuy onclose={setIsFilterOpen} />
      </Modal>

    </div>
  )
}