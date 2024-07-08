'use client'
import React, { useEffect, useState } from 'react';
import { IStock, IProduct, ISale } from '@aw/utils/interface';
import { supabase } from '@aw/lib/database';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@aw/components/ui/table';
import { Button } from '@aw/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogClose
} from '@aw/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@aw/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@aw/components/ui/select"
import { Input } from '@aw/components/ui/input';
import { PlusCircle, Search, Trash2 } from 'lucide-react';
import { Switch } from '@aw/components/ui/switch';

const formSchema = z.object({
  product_name: z.string({
    message: "É necessário selecionar um produto.",
  }),
  amount: z.string().min(1, {
    message: "É necessário informar ao menos 1 quantidade."
  }),
})

export default function ListStock() {
  const [search, setSearch] = useState('')
  const [stocks, setStocks] = useState<IStock[]>([])
  const [stock, setStock] = useState(false)
  const [products, setProducts] = useState<IProduct[]>([])
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_name: "",
      amount: "",
    },
  })

  async function getProducts() {
    const { data } = await supabase.from('products').select('*').order('name')
    if (data) {
      setProducts(data)
    }
  }

  async function getStocks(search?: string) {
    if (search) {
      const { data } = await supabase.from('stocks').select('*').eq('product_name', search)
      if (data) {
        setStocks(data)
      }
    } else {
      const { data } = await supabase.from('stocks').select('*')
      if (data) {
        setStocks(data)
      }
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await supabase.from('stocks').insert({
        product_name: values.product_name,
        amount: Number(values.amount),
        hasstock: true,
      })
      alert('Produto incluído no estoque com sucesso!')
      form.reset()
      getStocks()
    } catch (error) {
      console.log(error)
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Tem certeza que deseja excluir este produto do estoque?")) {
      try {
        await supabase.from('stocks').delete().eq('id', id)
        alert('Produto removido do estoque com sucesso!')
        getStocks()
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    getProducts()
    getStocks()
  }, [])

  return (
    <div>
      <h2 className='p-2 text-lg font-semibold my-2'>Cadastro de Produtos no Estoque</h2>
      <div className='flex items-center justify-between gap-4 mb-4'>
        <form className='flex flex-row gap-2'>
          <Input name="search" id='search' placeholder='Localizar' />
          <Button type='submit' variant="outline">
            <Search className='w-4 h-4 mr-2' onClick={() => getStocks()} />Buscar</Button>
        </form>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">
              <PlusCircle className='w-4 h-4 mr-2' />Novo Estoque</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Estoque</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                            <SelectItem key={pro.id} value={pro.name}>{pro.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade:</FormLabel>
                      <FormControl>
                        <Input placeholder="0" {...field} />
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
            <TableHead className='font-bold text-md w-32'>Produto</TableHead>
            <TableHead className='font-bold text-md'>Quant.</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stocks.map((stk) => (
            <TableRow key={stk.id}>
              <TableCell>{stk.product_name}</TableCell>
              <TableCell>{stk.amount}</TableCell>
              <TableCell width={30}><button onClick={() => handleDelete(stk.id)}><Trash2 className='w-4 h-4' /></button></TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="text-right">Total: {stocks.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
