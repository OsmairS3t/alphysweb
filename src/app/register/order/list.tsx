'use client'
import React, { useEffect, useState } from 'react';
import { IClient, IOrder, IProduct } from '@aw/utils/interface';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@aw/components/ui/select';

const formSchema = z.object({
  client_name: z.string(),
  product_name: z.string(),
  amount: z.string(),
  price: z.string(),
  obs: z.string()
})

export default function ListCategory() {
  const [search, setSearch] = useState('')
  const [clients, setClients] = useState<IClient[]>([])
  const [products, setProducts] = useState<IProduct[]>([])
  const [orders, setOrders] = useState<IOrder[]>([])
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_name: "",
      product_name: "",
      amount: "",
      price: "",
      obs: ""
    },
  })

  async function getClients() {
    const { data } = await supabase.from('clients').select('*').order('name')
    if (data) {
      setClients(data)
    }
  }

  async function getProducts() {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('categoryname', { ascending: true })
    if (data) {
      setProducts(data)
    }
  }

  async function getOrders(name?: string) {
    if(name) {
      const {data} = await supabase
        .from('orders')
        .select('*')
        .like('client', name)
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
        client_name: values.client_name,
        product_name: values.product_name,
        amount: Number(values.amount),
        price: Number(values.price),
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
    getClients()
    getProducts()
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
                  name="client_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente:</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o(a) cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map(cli => (
                            <SelectItem key={cli.id} value={cli.name}>{cli.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="product_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Produto:</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o produto" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {products.map(pro => (
                            <SelectItem key={pro.id} value={pro.name}>{pro.categoryname} - {pro.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
            <TableHead className='font-bold text-md text-center w-40'>Preço</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((ord) => (
            <TableRow key={ord.id}>
              <TableCell>{ord.client_name}</TableCell>
              <TableCell>{ord.product_name}</TableCell>
              <TableCell>{ord.amount}</TableCell>
              <TableCell className='text-right'>
                {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(ord.price)}
              </TableCell>
              <TableCell width={100} className='text-center'>
                <button onClick={() => handleDelete(ord.id)}><Trash2 className='w-4 h-4' /></button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}></TableCell>
            <TableCell className="text-right">
              Total: {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'})
                          .format(orders.reduce((accumulator, currentItem) => {
                      return accumulator + currentItem.price;
                     }, 0))}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
     
    </div>
  )
}
