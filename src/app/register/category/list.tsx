'use client'
import React, { useEffect, useState } from 'react';
import { ICategory } from '@aw/utils/interface';
import { supabase } from '@aw/lib/database';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow } from '@aw/components/ui/table';
import { Button } from '@aw/components/ui/button';
import { Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogTrigger, 
  DialogHeader, 
  DialogClose} from '@aw/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@aw/components/ui/form"
import { Input } from '@aw/components/ui/input';
import { PlusCircle, Search, Trash2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Categoria deve ter ao menos 2 caracteres.",
  }),
})

export default function ListCategory() {
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState<ICategory[]>([])
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  async function getCategories(name?: string) {
    if(name) {
      const {data} = await supabase.from('categories').select('*').like('name', name)
      if(data) {
        setCategories(data)
      }
    } else {
      const {data} = await supabase.from('categories').select('*').order('name')
      if(data) {
        setCategories(data)
      }
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await supabase.from('categories').insert({ name: values.name })
      alert('Categoria incluída com sucesso!')
      form.reset()
      getCategories()
    } catch (error) {
      console.log(error)
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
      try {
        await supabase.from('categories').delete().eq('id', id)
        alert('Categoria excluida com sucesso!')
        getCategories()
      } catch (error) {
        console.log(error)      
      }
    } 
  }

  function loadCategory() {
    
  }
 
  useEffect(() => {
    getCategories()
  },[])

  return (
    <div>
      <h2 className='p-2 text-lg font-semibold my-2'>Cadastro de categorias</h2>
      <div className='flex items-center justify-between gap-4 mb-4'>
        <form className='flex flex-row gap-2'>
          <Input name="search" id='search' placeholder='Categoria' />
          <Button type='submit' variant="outline">
            <Search className='w-4 h-4 mr-2' onClick={()=>getCategories()}/>Buscar</Button>
        </form>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">
              <PlusCircle className='w-4 h-4 mr-2' />Nova categoria</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Categoria</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria:</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da categoria" {...field} />
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
          </DialogContent>

        </Dialog> 
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead colSpan={2} className='font-bold text-md'>Categoria</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((cat) => (
            <TableRow key={cat.id}>
              <TableCell>{cat.name}</TableCell>
              <TableCell width={30}><button onClick={() => handleDelete(cat.id)}><Trash2 className='w-4 h-4' /></button></TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2} className="text-right">Total: {categories.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
     
    </div>
  )
}