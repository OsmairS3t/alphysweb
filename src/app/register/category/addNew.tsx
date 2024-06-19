'use client'
import React, { FormEvent, useEffect, useState } from 'react';
import { supabase } from '@aw/lib/database';
import { ICategory } from '@aw/utils/interface';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@aw/components/button';
import { buttonStyle, errorStyle, inputStyle } from '@aw/utils/stylesGlobal';

interface AddCategoryProps {
  onclose: (isOpen: boolean) => void;
  loadFunction: () => void;
  idcategory?: string;
}

const catSchema = z.object({
  name: z.string().min(2, {message: 'O nome deve ter no mínimo 2 caracteres.'})
})
type TCategory = z.infer<typeof catSchema>

export default function AddNewCategory({ onclose, loadFunction, idcategory }: AddCategoryProps) {
  const title_page = idcategory ? 'Alterar Categoria' : 'Nova categoria'
  const [category, setCategory] = useState<ICategory>()

  const { 
    handleSubmit, 
    register,
    reset,
    setValue, 
    formState:{ errors } 
  } = useForm<TCategory>({
    resolver: zodResolver(catSchema),
    defaultValues:{
      name: category?.name
    }
  })

  function handleClose() {
    onclose(false)
  }

  async function loadCategory() {
    if (idcategory) {
      const { data } = await supabase.from('categories').select('*').eq('id', idcategory)
      const values = JSON.stringify(data)
      setCategory(JSON.parse(values))
    }
  }

  async function handleSave(data: TCategory) {
    try {
      await supabase.from('categories').insert({ name: data.name })
      reset()
      loadFunction()
      alert('Categoria incluída com sucesso!')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if(idcategory) {
      loadCategory()
    }
  },[])

   return (
    <>
      <div className='flex flex-row justify-between items-center bg-slate-800 text-slate-100 font-medium p-2'>
        <h2>{title_page}</h2>
        <button
          className='p-1 w-8 h-8 rounded justify-center items-center bg-red-700 hover:bg-red-800 transition-all text-white font-bold'
          onClick={handleClose}>X</button>
      </div>

      <form onSubmit={handleSubmit(handleSave)} className='flex flex-col justify-start items-start my-4 p-2 border-2 border-slate-700'>
        <label htmlFor='name' className='text-slate-50 mb-2'>Categoria:</label>
        <input 
          className={inputStyle}
          id='name'
          placeholder='Nome de categoria'
          {...register('name')} 
        />
        {errors.name && (
          <span className={errorStyle}>
            {errors.name.message}
          </span>
        )}
        <input type='submit' className={buttonStyle} />
      </form>
    </>
  )
}
