'use client'
import React, { useEffect, useState } from 'react';
import { ICategory, IOrder } from '@aw/utils/interface';
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
import { Textarea } from '@aw/components/ui/textarea';

const formSchema = z.object({
  client: z.number(),
  product: z.number(),
  amount: z.number(),
  price: z.number(),
  obs: z.string()
})

export default function ListCategory() {
  const [search, setSearch] = useState('')
  const [orders, setOrders] = useState<IOrder[]>([])
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client: 0,
      product: 0,
      amount: 0,
      price: 0,
      obs: ""
    },
  })

  async function getOrders(name?: string) {
    if(name) {
      const {data} = await supabase.from('orders').select('*').like('client', name)
      if(data) {
        setOrders(data)
      }
    } else {
      const {data} = await supabase.from('orders').select('*')
      if(data) {
        setOrders(data)
      }
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await supabase.from('orders').insert({ 
        client: values.client,
        product: values.product,
        amount: values.amount,
        price: values.price,
        obs: values.obs
      })
      alert('Encomenda incluída com sucesso!')
      form.reset()
      getOrders()
    } catch (error) {
      console.log(error)
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Tem certeza que deseja excluir esta encomenda?")) {
      try {
        await supabase.from('orders').delete().eq('id', id)
        alert('Encomenda excluida com sucesso!')
        getOrders()
      } catch (error) {
        console.log(error)      
      }
    } 
  }

  useEffect(() => {
    getOrders()
  },[])

  return (
    <div>
      <h2 className='p-2 text-lg font-semibold my-2'>Cadastro de encomendas</h2>
      <div className='flex items-center justify-between gap-4 mb-4'>
        <form className='flex flex-row gap-2'>
          <Input name="search" id='search' placeholder='Categoria' />
          <Button type='submit' variant="outline">
            <Search className='w-4 h-4 mr-2' onClick={()=>getOrders()}/>Buscar</Button>
        </form>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">
              <PlusCircle className='w-4 h-4 mr-2' />Nova encomenda</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Encomenda</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name='client'
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
                <FormField
                  control={form.control}
                  name='product'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Produto:</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do Produto" {...field} />
                      </FormControl>
                      <FormDescription>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='amount'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade:</FormLabel>
                      <FormControl>
                        <Input placeholder="Quantidade" {...field} />
                      </FormControl>
                      <FormDescription>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='price'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço:</FormLabel>
                      <FormControl>
                        <Input placeholder="0,00" {...field} />
                      </FormControl>
                      <FormDescription>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='obs'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observação:</FormLabel>
                      <FormControl>
                        <Textarea {...field}></Textarea>
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
            <TableHead className='font-bold text-md'>Cliente</TableHead>
            <TableHead className='font-bold text-md'>Produto</TableHead>
            <TableHead className='font-bold text-md'>Quant.</TableHead>
            <TableHead className='font-bold text-md'>Preço</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((ord) => (
            <TableRow key={ord.id}>
              <TableCell>{ord.client?.name}</TableCell>
              <TableCell>{ord.product?.name}</TableCell>
              <TableCell>{ord.amount}</TableCell>
              <TableCell>{ord.price}</TableCell>
              <TableCell width={30}><button onClick={() => handleDelete(ord.id)}><Trash2 className='w-4 h-4' /></button></TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="text-right">Total: {orders.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
     
    </div>
  )
}
