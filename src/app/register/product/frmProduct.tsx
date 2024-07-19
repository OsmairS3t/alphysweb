import React, { useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from '@aw/components/ui/button';
import { Input } from '@aw/components/ui/input';
import { supabase } from '@aw/lib/database';
import { ICategory, IProduct } from '@aw/utils/interface';

const schemaProduct = z.object({
  name: z.string().min(2, {
    message: "O nome do produto deve ter ao menos 2 caracteres.",
  }),
  price: z.string().min(1, {
    message: "É necessário informar o preço.",
  }),
  photo: z.string(),
})
type TProduct = z.infer<typeof schemaProduct>
interface Props {
  frmPro: IProduct;
  onCloseDialog: (isOpen:boolean) => void;
  updateList: () => void;
}

export default function FormProduct({frmPro, onCloseDialog, updateList}: Props) {
  const nameCategory = frmPro.categoryname
  const [categories, setCategories] = useState<ICategory[]>([])
  const { register, handleSubmit, formState:{errors} } = useForm<TProduct>({
    resolver: zodResolver(schemaProduct)
  });

  const loadCategories = async() => {
    const { data } = await supabase.from('categories').select('*').order('name')
    if (data) {
      setCategories(data)
    }
  }

  const onSubmit: SubmitHandler<TProduct> = async (data) => {
    console.log(nameCategory, data)
    try {
      await supabase.from('products').update({ 
        categoryname: nameCategory,
        name: data.name,
        price: data.price,
        photo: data.photo,
      }).eq('id', frmPro.id)
      alert('Produto alterado com sucesso!')
      onCloseDialog(false)
      updateList()
    }catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadCategories()
  },[])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className='flex flex-col'>
        <span className='font-semibold'>Categoria:</span>
        <span>{nameCategory}</span>
      </div>

      <div className='flex flex-col'>
        <label className='font-semibold'>Produto:</label>
        <Input
          placeholder="Nome do Produto"
          defaultValue={frmPro.name}
          {...register('name')}
        />
      </div>

      <div className='flex flex-col'>
        <label className='font-semibold'>Preço:</label>
        <Input
          placeholder="Preço"
          defaultValue={frmPro.price}
          {...register('price')}
        />
      </div>

      <div className='flex flex-col'>
        <label className='font-semibold'>Foto:</label>
        <Input
          placeholder="Foto"
          defaultValue={frmPro.photo}
          {...register('photo')}
        />
      </div>
      <Button type="submit">Atualizar</Button>
    </form>
  )
}