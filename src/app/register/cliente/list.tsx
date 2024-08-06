'use client'
import React, { useEffect, useState } from 'react';
import { ICategory, IClient } from '@aw/utils/interface';
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
    message: "Nome do Cliente deve ter ao menos 2 caracteres.",
  }),
})

export default function ListClients() {
  const [search, setSearch] = useState('')
  const [clients, setClients] = useState<IClient[]>([])
  const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  async function getClients(name?: string) {
    if(name) {
      const {data} = await supabase
        .from('clients')
        .select('*')
        .like('name', name)
        .order('name')
      if(data) {
        setClients(data)
      }
    } else {
      const {data} = await supabase
        .from('clients')
        .select('*')
        .order('name')
      if(data) {
        setClients(data)
      }
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await supabase.from('clients').insert({ name: values.name })
      alert('Cliente incluído com sucesso!')
      form.reset()
      getClients()
    } catch (error) {
      console.log(error)
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        await supabase.from('clients').delete().eq('id', id)
        alert('Cliente excluido com sucesso!')
        getClients()
      } catch (error) {
        console.log(error)      
      }
    } 
  }

  function loadClient() {
    
  }

  useEffect(() => {
    getClients()
  },[])

  return (
    <div>
      <h2 className='p-2 text-lg font-semibold my-2'>Cadastro de Clientes</h2>
      <div className='flex items-center justify-between gap-4 mb-4'>
        <form className='flex flex-row gap-2'>
          <Input name="search" id='search' placeholder='Pesquisar cliente' />
          <Button type='submit' variant="outline">
            <Search className='w-4 h-4 mr-2' onClick={()=>getClients()}/>Buscar</Button>
        </form>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">
              <PlusCircle className='w-4 h-4 mr-2' />Novo Cliente</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Cliente</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente:</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do Cliente" {...field} />
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
            <TableHead colSpan={2} className='font-bold text-md'>Cliente</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((cli) => (
            <TableRow key={cli.id}>
              <TableCell>{cli.name}</TableCell>
              <TableCell width={30}><button onClick={() => handleDelete(cli.id)}><Trash2 className='w-4 h-4' /></button></TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2} className="text-right">Total: {clients.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    
    </div>
  )
}
