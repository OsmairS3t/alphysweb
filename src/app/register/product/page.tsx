'use client'
import React, { useState } from 'react';
import Modal from 'react-modal';
import ListProduct from './list';
import HeaderPage from '@aw/components/headerPage';
import AddNewProduct from './addNew';
import FilterProduct from './filter';
import { styleModalContainer } from '@aw/utils/styleModal';

export default function Product() {
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
      <HeaderPage title='Cadastro de Produtos' onAddClick={handleNew} onFilterClick={handleFilter} />
      <ListProduct />
      
      <Modal
        isOpen={isAddOpen}
        ariaHideApp={false}
        contentLabel="Adicionar Novo"
        style={styleModalContainer}
      >
        <AddNewProduct onclose={setIsAddOpen} />
      </Modal>
      
      <Modal
        isOpen={isFilterOpen}
        ariaHideApp={false}
        contentLabel="Filtrar Produto"
        style={styleModalContainer}
      >
        <FilterProduct onclose={setIsFilterOpen} />
      </Modal>

    </div>
  )
}