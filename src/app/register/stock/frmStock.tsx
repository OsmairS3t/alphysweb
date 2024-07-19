import React, { useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from '@aw/components/ui/button';
import { Input } from '@aw/components/ui/input';
import { supabase } from '@aw/lib/database';
import { IStock, IProduct } from '@aw/utils/interface';

const schemaStock = z.object({
  amount: z.string().min(1, {
    message: "É necessário informar a quantidade.",
  }),
})
type TStock = z.infer<typeof schemaStock>
interface Props {
  frmStock: IStock;
  onCloseDialog: (isOpen:boolean) => void;
  updateList: () => void;
}

export default function FormStock({frmStock, onCloseDialog, updateList}: Props) {
  const nameProduct = frmStock.product_name
  const { register, handleSubmit, formState:{errors} } = useForm<TStock>({
    resolver: zodResolver(schemaStock)
  });

  const onSubmit: SubmitHandler<TStock> = async (data) => {
    console.log(nameProduct, data)
    try {
      await supabase.from('stocks').update({ 
        product_name: nameProduct,
        amount: Number(data.amount),
        hasstock: (Number(data.amount) > 0) ? true : false
      }).eq('id', frmStock.id)
      alert('Estoque alterado com sucesso!')
      onCloseDialog(false)
      updateList()
    }catch (error) {
      console.log(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className='flex flex-col'>
        <span className='font-semibold'>Produto:</span>
        <span>{nameProduct}</span>
      </div>

      <div className='flex flex-col'>
        <label className='font-semibold'>Quantidade:</label>
        <Input
          placeholder="0"
          defaultValue={frmStock.amount}
          {...register('amount')}
        />
      </div>

      <Button type="submit">Atualizar</Button>
    </form>
  )
}