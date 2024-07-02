'use client'
import React, { useEffect, useState } from 'react';
import { IBuy, ICategory, IClient, IProduct, ISale } from '@aw/utils/interface';
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
import { PlusCircle, Search, SearchCheckIcon, Trash2 } from 'lucide-react';
import { Switch } from '@aw/components/ui/switch';

const formSchema = z.object({
  client: z
    .string({
      required_error: "É necessário selecionar uma cliente.",
    }),
  product: z.string({
    message: "É necessário selecionar um produto.",
  }),
  amount: z.string().min(1, {
    message: "É necessário informar ao menos 1 quantidade."
  }),
  price: z.string().min(1, {
    message: "É necessário informar o preço.",
  }),
  ispaid: z.boolean(),
})

export default function ListSale() {
  const [search, setSearch] = useState('')
  const [clients, setClients] = useState<IClient[]>([])
  const [products, setProducts] = useState<IProduct[]>([])
  const [sales, setSales] = useState<ISale[]>([])
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client: "",
      product: "",
      amount: "",
      price: "",
      ispaid: false
    },
  })

  async function getClients() {
    const { data } = await supabase.from('clients').select('*').order('name')
    if (data) {
      setClients(data)
    }
  }

  async function getProducts() {
    const { data } = await supabase.from('products').select('*').order('name')
    if (data) {
      setProducts(data)
    }
  }

  async function getSales(search?: string, searchType?: string) {
    if (!searchType) {
      const { data } = await supabase.from('sales').select('*').order('datesale')
      if (data) {
        setSales(data)
      }
    } else {
      if (search) {
        const searchid = 2  //localizar no banco o id do produto
        if (searchType === 'product') {
          const { data } = await supabase
            .from('sales')
            .select('*')
            .eq('productid', searchid)
            .order('datesale')
          if (data) {
            setSales(data)
          }
        } else {
          const { data } = await supabase
            .from('sales')
            .select('*')
            .eq('productid', searchid)
            .order('datesale')
          if (data) {
            setSales(data)
          }
        }
      }
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await supabase.from('sales').insert({
        clientid: values.client,
        productid: values.product,
        amount: Number(values.amount),
        price: Number(values.price),
        ispaid: values.ispaid,
        datesale: new Date().getDate()
      })
      alert('venda incluída com sucesso!')
      form.reset()
      getSales()
    } catch (error) {
      console.log(error)
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Tem certeza que deseja excluir esta venda?")) {
      try {
        await supabase.from('sales').delete().eq('id', id)
        alert('Venda excluida com sucesso!')
        getSales()
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    getClients()
    getProducts()
    getSales()
  }, [])

  return (
    <div>
      <h2 className='p-2 text-lg font-semibold my-2'>Cadastro de Produtos</h2>
      <div className='flex items-center justify-between gap-4 mb-4'>
        <form className='flex flex-row gap-2'>
          <Input name="search" id='search' placeholder='Localizar' />
          <Button type='submit' variant="outline">
            <Search className='w-4 h-4 mr-2' onClick={() => getSales()} />Buscar</Button>
        </form>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">
              <PlusCircle className='w-4 h-4 mr-2' />Nova Venda</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Venda</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="client"
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
                            <SelectItem key={cli.id} value={cli.id}>{cli.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="product"
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
                            <SelectItem key={pro.id} value={pro.id}>{pro.name}</SelectItem>
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

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço:</FormLabel>
                      <FormControl>
                        <Input placeholder="0.00" {...field} />
                      </FormControl>
                      <FormDescription>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ispaid"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Pagamento
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
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
            <TableHead className='font-bold text-md w-32'>Cliente</TableHead>
            <TableHead className='font-bold text-md w-32'>Produto</TableHead>
            <TableHead className='font-bold text-md'>Quant.</TableHead>
            <TableHead className='font-bold text-md'>Preço</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((pro) => (
            <TableRow key={pro.id}>
              <TableCell>{pro.category?.name}</TableCell>
              <TableCell>{pro.name}</TableCell>
              <TableCell className='text-right'>{pro.price}</TableCell>
              <TableCell width={30}><button onClick={() => handleDelete(pro.id)}><Trash2 className='w-4 h-4' /></button></TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="text-right">Total: {products.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

