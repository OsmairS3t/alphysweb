'use client'
import React, { useEffect, useState } from 'react';
import { IStock, IProduct } from '@aw/utils/interface';
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
import { Edit2, PlusCircle, Search, Trash2 } from 'lucide-react';
import { Switch } from '@aw/components/ui/switch';
import { DialogDescription } from '@radix-ui/react-dialog';
import FormStock from './frmStock';

const formSchema = z.object({
  idProduct: z.string({
    message: "É necessário selecionar um produto.",
  }),
  amount: z.string().min(1, {
    message: "É necessário informar ao menos 1 quantidade."
  }),
})

export default function ListStock() {
  const [search, setSearch] = useState('')
  const [stocks, setStocks] = useState<IStock[]>([])
  const [products, setProducts] = useState<IProduct[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [frmStock, setFrmStock] = useState<IStock>(
    {
    id: '',
    product_name: '',
    amount: 0,
    hasStock: false
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idProduct: "",
      amount: "",
    },
  })
  
  async function loadStock(id: string) {
    const { data } = await supabase.from('stocks').select('*').eq('id', id)
    if(data) {
      setFrmStock(data[0])
    }
    setDialogOpen(true)
  }

  async function getProducts() {
    const { data } = await supabase.from('products').select('*').order('categoryname', {ascending:true})
    if (data) {
      setProducts(data)
    }
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  async function getStocks(search?: string) {
    if (search) {
      const { data } = await supabase.from('stocks').select('*').eq('product_name', search)
      if (data) {
        setStocks(data)
      }
    } else {
      const { data } = await supabase.from('stocks').select('*').order('product_name', {ascending: true})
      if (data) {
        setStocks(data)
      }
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data } = await supabase.from('products').select('*').eq('id', Number(values.idProduct))
      if (data) {
        const productName = data[0].categoryname +' - '+ data[0].name
        const productId = data[0].id
        await supabase.from('stocks').insert({
          product_id: Number(productId),
          product_name: productName,
          amount: Number(values.amount),
          hasstock: true,
        })
        alert('Produto incluído no estoque com sucesso!')
        form.reset()
        getStocks()
      }
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
                  name="idProduct"
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
                            <SelectItem key={pro.id} value={String(pro.id)}>{pro.categoryname} - {pro.name}</SelectItem>
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

        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild></DialogTrigger>
          <DialogContent>
            <DialogDescription></DialogDescription>
            <DialogHeader>
              <DialogTitle>Editar Produto</DialogTitle>
            </DialogHeader>
            <FormStock frmStock={frmStock} onCloseDialog={setDialogOpen} updateList={getStocks} />
          </DialogContent>
        </Dialog> 
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='font-bold text-md'>Produto</TableHead>
            <TableHead className='font-bold text-md text-center w-32'>Quantidade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stocks.map((stk) => (
            <TableRow key={stk.id}>
              <TableCell>{stk.product_name}</TableCell>
              <TableCell className='text-center'>{stk.amount}</TableCell>
              <TableCell width={30}><button onClick={() => loadStock(stk.id)}><Edit2 className='w-4 h-4' /></button></TableCell>
              <TableCell width={30}><button onClick={() => handleDelete(stk.id)}><Trash2 className='w-4 h-4' /></button></TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className='text-right'>Total de produtos no estoque:</TableCell>
            <TableCell className='text-center'>{stocks.reduce((acc, obj) => acc + obj.amount, 0)}</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
