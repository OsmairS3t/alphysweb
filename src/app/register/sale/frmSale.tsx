'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@aw/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@aw/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@aw/components/ui/select";
import { Input } from "@aw/components/ui/input";
import { Switch } from "@aw/components/ui/switch";
import { CalendarIcon, PlusCircle, Search, Trash2 } from 'lucide-react';
import { IClient, IProduct, IStock } from "@aw/utils/interface";
import { supabase } from "@aw/lib/database";
import { useEffect, useState } from "react";
import { DialogClose } from "@aw/components/ui/dialog";
import { cn } from '@aw/lib/utils'
import { format, formatISO } from "date-fns"
import { Calendar } from '@aw/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@aw/components/ui/popover'

const FormSchema = z.object({
  client_name: z
    .string({
      required_error: "É necessário selecionar uma cliente.",
    }),
  product_id: z.string({
    message: "É necessário selecionar um produto.",
  }),
  amount: z.string().min(1, {
    message: "É necessário informar ao menos 1 quantidade."
  }),
  ispaid: z.boolean().optional(),
  datetransaction: z.date({
    required_error: "A data da venda é necessária",
  }),
})

interface FormSaleProps {
  listUpdate: () => void;
}

export function FrmSale({ listUpdate }: FormSaleProps) {
  let dataAtual = new Date();
  let day = String(dataAtual.getDate()).padStart(2, '0');
  let month = String(dataAtual.getMonth() + 1).padStart(2, '0');
  let year = dataAtual.getFullYear();
  let dataAtualFormatada = day + '/' + month + '/' + year;
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })
  const [clients, setClients] = useState<IClient[]>([])
  const [stocks, setStocks] = useState<IStock[]>([])

  async function loadClients() {
    const { data } = await supabase.from('clients').select('*')
    if (data) {
      setClients(data)
    }
  }

  async function loadProducts() {
    const { data } = await supabase.from('stocks').select('*').order('product_name')
    if (data) {
      setStocks(data)
    }
  }

  async function onSubmit(dataForm: z.infer<typeof FormSchema>) {
    let productName
    let salePrice
    const { data } = await supabase.from('products').select('*').eq('id', Number(dataForm.product_id))
    if (data) {
      productName = data[0].categoryname + ' - ' + data[0].name
      salePrice = Number(data[0].price) * Number(dataForm.amount)
    }
    const stockTemp = await supabase.from('stocks').select('*').eq('product_id', Number(dataForm.product_id))
    if (stockTemp.data) {
      let stockId = stockTemp.data[0].stock_id
      if (Number(stockTemp.data[0].amount) < Number(dataForm.amount)) {
        alert('Não há estoques suficientes para esta venda.')
        return false;
      } else {
        await supabase.from('transactions').insert({
          stock_id: Number(stockId),
          modality: 'sale',
          client_name: dataForm.client_name,
          product_name: productName,
          amount: Number(dataForm.amount),
          price: salePrice,
          ispaid: dataForm.ispaid,
          datetransaction: dataForm.datetransaction.toLocaleDateString()
        })
        alert('Venda incluída com sucesso!')
        form.reset()
        listUpdate()
      }
    }
  }

  useEffect(() => {
    loadClients();
    loadProducts();
  }, [])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="client_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente:</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients.map(item => (
                    <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="product_id"
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
                  {stocks.map(item => (
                    <SelectItem key={item.id} value={String(item.product_id)}>{item.product_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription></FormDescription>
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
              <FormDescription></FormDescription>
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
                <FormLabel className="text-base">Está pago?</FormLabel>
                <FormDescription></FormDescription>
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
                Data da Venda
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