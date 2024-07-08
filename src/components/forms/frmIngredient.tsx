import React, { ChangeEvent, useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@aw/components/ui/form"
import { IIngredient, IRecipe } from '@aw/utils/interface';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { supabase } from '@aw/lib/database';
import { DialogClose } from '../ui/dialog';

const frmIngredSchema = z.object({
  id: z.string(),
  name: z.string(),
  amount: z.string(),
  conditions: z.string()
})

type IngredientRecipeProps = {
  idrecipe: string;
}

export default function FormIngredient({ idrecipe }:IngredientRecipeProps) {
  const [ingredients, setIngredients] = useState<IIngredient[]>([]);
  const [recipe, setRecipe] = useState<IRecipe[]>([])
  const frmIngred = useForm<z.infer<typeof frmIngredSchema>>({
    defaultValues: {
      name: '',
      amount: '',
      conditions:''
    }
  })

  async function loadIngredients(id: string) {
    try {
      const { data } = await supabase.from('recipes').select('*').eq('id', Number(id))
      if (data) {
        setRecipe(data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function onSubmit(values: z.infer<typeof frmIngredSchema>) {
    try {
      await supabase.from('recipes').insert({ 
        name: values.name,
        amount: values.amount,
        conditions: values.conditions,
      })
      alert('Receita incluída com sucesso!')
      frmIngred.reset()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadIngredients(idrecipe)
  },[])

  return (
    <Form {...frmIngred}>
      <form onSubmit={frmIngred.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={frmIngred.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do produto:</FormLabel>
              <FormControl>
                <Input placeholder="Nome do produto" {...field} />
              </FormControl>
              <FormDescription>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={frmIngred.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do produto:</FormLabel>
              <FormControl>
                <Input placeholder="0 (gramas, litros...)" {...field} />
              </FormControl>
              <FormDescription>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={frmIngred.control}
          name="conditions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Condições:</FormLabel>
              <FormControl>
                <Input placeholder="Morno, quente, peneirado..." {...field} />
              </FormControl>
              <FormDescription>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex flex-row justify-end gap-2'>
          <DialogClose>
            <Button type='button' variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type='submit'>Salvar</Button>
        </div>
    </form>
  </Form>

  )
}