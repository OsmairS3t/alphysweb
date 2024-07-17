import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from '@aw/components/ui/button';
import { Input } from '@aw/components/ui/input';
import { supabase } from '@aw/lib/database';
import { ICategory } from '@aw/utils/interface';

const schemaCategory = z.object({
  name: z.string().min(2, 'O nome da categoria deve conter no mínimo 2 caracteres.'),
})
type TCategory = z.infer<typeof schemaCategory>

export default function FormCategory({frmCat}:{frmCat:ICategory}) {
  const { register, handleSubmit, formState:{errors} } = useForm<TCategory>({
    resolver: zodResolver(schemaCategory)
  });

  const onSubmit: SubmitHandler<TCategory> = async (data) => {
    try {
      await supabase.from('categories').update({ name: data.name }).eq('id', frmCat.id)
      alert('Categoria alterada com sucesso!')
    }catch (error) {
      console.log(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        className='mt-4'
        placeholder="Categoria"
        defaultValue={frmCat.name}
        {...register('name')}
      />
      <Button type="submit">Atualizar</Button>
    </form>
  )
}