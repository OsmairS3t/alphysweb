'use client'
import React, { useEffect, useState } from 'react';
import InputText from '@aw/components/input';
import { supabase } from '@aw/lib/database';
import { ICategory } from '@aw/utils/interface';

interface AddCategoryProps {
  onclose: (isOpen: boolean) => void;
  loadFunction: () => void;
  idcategory?: number;
}

export default function AddNewCategory({ onclose, loadFunction, idcategory }: AddCategoryProps) {
  const title_page = idcategory ? 'Alterar Categoria' : 'Nova categoria'
  const [category, setCategory] = useState<ICategory>()

  function handleClose() {
    onclose(false)
  }

  async function loadCategory() {
    if (idcategory) {
      const { data, error } = await supabase.from('categories').select()
      console.log(data)
    }
  }

  async function handleSave(formData: FormData) {
    const rawFormData = {
      name: formData.get('name'),
    }
    try {
      await supabase.from('categories').insert({ name: rawFormData.name })
      loadFunction()
      alert('Categoria incluída com sucesso!')
    } catch (error) {
      console.log(error)
    }
  }

  async function handleEdit(formData: FormData) {
    const rawFormData = {
      name: formData.get('name'),
    }
    try {
      await supabase.from('categories').insert({ name: rawFormData.name })
      loadFunction()
      alert('Categoria incluída com sucesso!')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (idcategory) {loadCategory()}
  },[])

  return (
    <>
      <div className='flex flex-row justify-between items-center bg-slate-800 text-slate-100 font-medium p-2'>
        <h2>{title_page}</h2>
        <button
          className='p-1 w-8 h-8 rounded justify-center items-center bg-red-700 hover:bg-red-800 transition-all text-white font-bold'
          onClick={handleClose}>X</button>
      </div>

      <form action={handleSave} className='flex flex-col justify-start items-start my-4 p-2 border-2 border-slate-700'>
        <label htmlFor='name' className='text-slate-50 mb-2'>Categoria:</label>
        <InputText 
          id='name'
          name='name'
          placeholder='Nome de categoria'
        />
        <button
          type='submit'
          className='p-2 w-36 h-10 rounded my-4 border-2 border-green-500 bg-green-600 hover:bg-green-700 transition-all'
        >
          Salvar
        </button>
      </form>
    </>
  )
}
