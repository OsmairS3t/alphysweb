'use client'
import React, { useState } from 'react';
import Modal from 'react-modal';
import ListSale from './list';
import HeaderPage from '@aw/components/headerPage';
import AddNewSale from './addNew';
import FilterSale from './filter';
import { styleModalContainer } from '@aw/utils/styleModal';

export default function Sale() {
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
      <HeaderPage title='Cadastro de Vendas' onAddClick={handleNew} onFilterClick={handleFilter} />
      <ListSale />
      
      <Modal
        isOpen={isAddOpen}
        ariaHideApp={false}
        contentLabel="Adicionar Novo"
        style={styleModalContainer}
      >
        <AddNewSale onclose={setIsAddOpen} />
      </Modal>
      
      <Modal
        isOpen={isFilterOpen}
        ariaHideApp={false}
        contentLabel="Filtrar Venda"
        style={styleModalContainer}
      >
        <FilterSale onclose={setIsFilterOpen} />
      </Modal>

    </div>
  )
}