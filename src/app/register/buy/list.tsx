'use client'
import React, { useEffect, useState } from 'react';
import { ITransaction } from '@aw/utils/interface';
import { supabase } from '@aw/lib/database';
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, PlusCircle, Search, Trash2 } from 'lucide-react';
import { cn } from '@aw/lib/utils'
import { format, formatISO } from "date-fns"
import { Calendar } from '@aw/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@aw/components/ui/popover'
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

const formSchema = z.object({
  kind: z.string().min(2, {
    message: "O tipo deve ter ao menos 2 caracteres.",
  }),
  product_name: z.string().min(2, {
    message: "O produto deve ter ao menos 2 caracteres.",
  }),
  place: z.string().min(2, {
    message: "O local deve ter ao menos 2 caracteres.",
  }),
  amount: z.string().min(1, {
    message: "É necessário informar a quantidade.",
  }),
  price: z.string().min(1, {
    message: "É necessário informar o preço.",
  }),
  datetransaction: z.date({
    required_error: "A data da movimentação é necessária",
  }),
})

export default function ListBuy() {
  const [search, setSearch] = useState('')
  const [buys, setBuys] = useState<ITransaction[]>([])
  let totalPrice = 0
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)})

  async function getBuys(name?: string) {
    if(name) {
      const {data} = await supabase.from('transactions').select('*').eq('modality','buy').like('name', name)
      if(data) {
        setBuys(data)
      }
    } else {
      const {data} = await supabase.from('transactions').select('*').eq('modality','buy')
      if(data) {
        setBuys(data)
      }
    }
    totalPrice = buys.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.price;
    }, 0);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await supabase.from('transactions').insert({ 
        kind: values.kind,
        modality: 'buy',
        place: values.place,
        product_name: values.product_name,
        amount: Number(values.amount),
        price: Number(values.price),
        datetransaction: values.datetransaction.toLocaleDateString()
      })
      alert('Compra incluída com sucesso!')
      form.reset()
      getBuys()
    } catch (error) {
      console.log(error)
    }
  }

  async function handleDelete(id: number) {
    if (confirm("Tem certeza que deseja excluir esta compra?")) {
      try {
        await supabase.from('transactions').delete().eq('id', id)
        alert('Compra excluida com sucesso!')
        getBuys()
      } catch (error) {
        console.log(error)      
      }
    } 
  }
 
  useEffect(() => {
    getBuys()
  },[])

  return (
    <div>
      <h2 className='p-2 text-lg font-semibold my-2'>Cadastro de compras</h2>
      <div className='flex items-center justify-between gap-4 mb-4'>
        <form className='flex flex-row gap-2'>
          <Input name="search" id='search' placeholder='Localizar' />
          <Button type='submit' variant="outline">
            <Search className='w-4 h-4 mr-2' onClick={()=>getBuys()}/>Buscar</Button>
        </form>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">
              <PlusCircle className='w-4 h-4 mr-2' />Nova compra</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Compra</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="kind"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo do produto:</FormLabel>
                      <FormControl>
                        <Input placeholder="Tipo do produto" {...field} />
                      </FormControl>
                      <FormDescription>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="product_name"
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
                  control={form.control}
                  name="place"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Local da compra:</FormLabel>
                      <FormControl>
                        <Input placeholder="Local da compra" {...field} />
                      </FormControl>
                      <FormDescription>
                      </FormDescription>
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
                        <Input type='number' placeholder="0.00" {...field} />
                      </FormControl>
                      <FormDescription>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="datetransaction"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data:</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PP")
                              ) : (
                                <span>Informe a Data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Data da movimentação financeira
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
            <TableHead className='font-bold text-md w-32'>Data</TableHead>
            <TableHead className='font-bold text-md w-32'>Tipo</TableHead>
            <TableHead className='font-bold text-md'>Local</TableHead>
            <TableHead className='font-bold text-md'>Produto</TableHead>
            <TableHead className='font-bold text-md w-32'>Quant.</TableHead>
            <TableHead className='font-bold text-md w-32 text-center'>Valor</TableHead>
            <TableHead className='font-bold text-md w-20'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {buys.map((buy) => (
            <TableRow key={buy.id}>
              <TableCell>{buy.datetransaction}</TableCell>
              <TableCell>{buy.kind}</TableCell>
              <TableCell>{buy.place}</TableCell>
              <TableCell>{buy.product_name}</TableCell>
              <TableCell>{buy.amount}</TableCell>
              <TableCell className='text-right'>
                {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(buy.price)}
              </TableCell>
              <TableCell width={30}>
                <button onClick={() => handleDelete(buy.id)}>
                  <Trash2 className='w-4 h-4' />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6} className="text-right">
              Total: {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'})
                          .format(buys.reduce((accumulator, currentItem) => {
                              return accumulator + currentItem.price;
                              }, 0))
                      }
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
