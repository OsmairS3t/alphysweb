import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from '@aw/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@aw/components/ui/form';
import { Input } from '@aw/components/ui/input';
import { supabase } from '@aw/lib/database';
import { ICategory } from '@aw/utils/interface';

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(2, {
    message: "Categoria deve ter ao menos 2 caracteres.",
  }),
})

export default function FormCategory({frmCat}:{frmCat:ICategory}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })
  
  async function onUpdate(values: z.infer<typeof formSchema>) {
    console.log(values)
    try {
      await supabase.from('categories').update({ name: values.name }).eq('id', values.id)
      alert('Categoria alterada com sucesso!')
      form.reset()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onUpdate)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria:</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  defaultValue={frmCat.name}
                  placeholder="Nome da categoria" 
                />
              </FormControl>
              <FormDescription>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Salvar</Button>
      </form>
    </Form>
  )
}