'use client'
import { supabase } from '@aw/lib/database';
import React, { useState } from 'react';

interface AddCategoryProps {
  onclose: (isOpen: boolean) => void;
}

export default function AddNewCategory({ onclose }: AddCategoryProps) {
  const [name, setName] = useState('')

  function handleClose() {
    onclose(false)
  }

  async function handleSave(formData: FormData) {
    const rawFormData = {
      name: formData.get('name'),
    }
    console.log(rawFormData)
    try {
      await supabase.from('categories').insert({ name: rawFormData.name })
      alert('Categoria incluída com sucesso!')
    } catch (error) {
      console.log(error)
    }
    // mutate data
    // revalidate cache
  }

  return (
    <>
      <div className='flex flex-row justify-between items-center bg-slate-300 text-slate-950 font-medium p-2'>
        <h2>Nova categoria</h2>
        <button
          className='p-1 w-8 h-8 rounded justify-center items-center bg-red-700 hover:bg-red-800 transition-all text-white font-bold'
          onClick={handleClose}>X</button>
      </div>

      <form action={handleSave} className='flex flex-col justify-start items-start my-4 p-2 border-2 border-slate-700'>
        <label htmlFor='name' className='text-slate-900 mb-2'>Categoria:</label>
        <input
          type='text'
          id='name'
          name='name'
          placeholder='Nome da categoria'
          className='p-2 border-[1px] border-gray-600 rounded-md w-full lg:w-1/3 text-slate-900'
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