'use client'
import React, { useEffect, useState } from 'react';
import { IClient, IProduct, IStock, ITransaction } from '@aw/utils/interface';
import { supabase } from '@aw/lib/database';
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
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
  // client_name: z
  //   .string({
  //     required_error: "É necessário selecionar uma cliente.",
  //   }),
  // product_name: z.string({
  //   message: "É necessário selecionar um produto.",
  // }),
  amount: z.string().min(1, {
    message: "É necessário informar ao menos 1 quantidade."
  }),
  // ispaid: z.boolean().optional(),
})

export default function ListSale() {
  // const [search, setSearch] = useState('')
  let amountTmp = 0
  let priceTmp = 0
  const [clientName, setClientName] = useState('')
  const [productName, setProductName] = useState('')
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState(0)
  const [isPay, setIsPay] = useState(false)
  const [clients, setClients] = useState<IClient[]>([])
  const [stocks, setStocks] = useState<IStock[]>([])
  const [sales, setSales] = useState<ITransaction[]>([])
  const { handleSubmit, register, reset, formState: {errors}} = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)})

  function handleChangeSales() {
    setIsPay(!isPay)
  }

  async function handleSelectProduct() {
    const productid = document.getElementById('product_id') as HTMLSelectElement
    const { data } = await supabase.from('products').select('*').eq('id', String(productid.value))
    if (data) {
      setProductName(data[0].name)
      priceTmp = Number(data[0].price)
    }
    if ((amountTmp > 0) && (priceTmp > 0)) {
      setPrice(amountTmp * priceTmp)
    }
    return document.getElementById("amount")?.focus()
  } 
  
  function handleUpdatePrice() {
    const amount = document.getElementById('amount') as HTMLInputElement
    if (amount) {
      amountTmp = Number(amount.value)
    }
    if ((amountTmp > 0) && (priceTmp > 0)) {
      setPrice(amountTmp * priceTmp)
    }
  }

  async function getClients() {
    const { data } = await supabase.from('clients').select('*').order('name')
    if (data) {
      setClients(data)
    }
  }

  async function getStocks() {
    const { data } = await supabase.from('stocks').select('*').order('product_name')
    if (data) {
      setStocks(data)
    }
  }

  async function getStockProduct(product: string) {
    const { data } = await supabase.from('stocks').select('*').eq('product_id', product)
    if (data) {
      return data[0]
    } 
    return
  }

  async function getSales(search?: string, searchType?: string) {
    if (!searchType) {
      const { data } = await supabase.from('transactions').select('*').eq('modality','sale').order('datetransaction')
      if (data) {
        setSales(data)
      }
    } else {
      if (search) {
        if (searchType === 'product') {
          const { data } = await supabase
            .from('transactions')
            .select('*')
            .eq('modality','sale')
            .eq('product_name', search)
            .order('datetransaction')
          if (data) {
            setSales(data)
          }
        } else {
          const { data } = await supabase
            .from('transactions')
            .select('*')
            .eq('modality','sale')
            .eq('client_name', search)
            .order('datetransaction')
          if (data) {
            setSales(data)
          }
        }
      }
    }
  }

  type TTransaction = {
    amount: string; 
  }

  const onSubmit: SubmitHandler<TTransaction> = async(data) => {
    let dataAtual = new Date();
    let day = String(dataAtual.getDate()).padStart(2, '0');
    let month = String(dataAtual.getMonth() + 1).padStart(2, '0'); 
    let year = dataAtual.getFullYear();
    let dataFormatada = day +'/'+ month +'/'+ year;
    const client_name = document.getElementById('client_name') as HTMLSelectElement
    setClientName(client_name.value)
    const dataInclude = {
      client_name: clientName,
      product_name: productName,
      amount: amount,
      price: price,
      ispaid: isPay
    }
    console.log(dataInclude)
    // const stockTemp:IStock = await getStockProduct(productName)
    // if (stockTemp) {
    //   if (Number(stockTemp.amount) < Number(amount)) { 
    //     alert('Não há estoques suficientes para esta venda.')
    //     return false;
    //   } else {
    //     try {
    //       await supabase.from('stocks')
    //       .update({ amount: Number(stockTemp.amount) - Number(data.amount) })
    //       .eq('product_name',data.product_name)
    //       await supabase.from('transactions').insert({
    //         modality: 'sale',
    //         client_name: data.client_name,
    //         product_name: data.product_name,
    //         amount: Number(data.amount),
    //         price: price,
    //         ispaid: isPay,
    //         datetransaction: dataFormatada
    //       })
    //       alert('Venda incluída com sucesso!')
    //       reset()
    //       getSales()
    //     } catch (error) {
    //       console.log(error)
    //     }
    //   }
    // } else {
    //   try {
    //     await supabase.from('transactions').insert({
    //       modality: 'sale',
    //       client_name: data.client_name,
    //       product_name: data.product_name,
    //       amount: Number(data.amount),
    //       price: price,
    //       ispaid: isPay,
    //       datetransaction: dataFormatada
    //     })
    //     alert('Venda incluída com sucesso!')
    //     reset()
    //     getSales()
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
  }

  async function handleDelete(id: number) {
    if (confirm("Tem certeza que deseja excluir esta venda?")) {
      try {
        await supabase.from('transactions').delete().eq('id', id)
        alert('Venda excluida com sucesso!')
        getSales()
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    getClients()
    getStocks()
    getSales()
  }, [])

  return (
    <div>
      <h2 className='p-2 text-lg font-semibold my-2'>Cadastro de Vendas</h2>
      <div className='flex items-center justify-between gap-4 mb-4'>
        <form className='flex flex-row gap-2'>
          <Input name="search" id='search' placeholder='Localizar' />
          <Button type='submit' variant="outline">
            <Search className='w-4 h-4 mr-2' onClick={() => getSales()} />Filtrar</Button>
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

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className='font-semibold'>Cliente:</label>
                  <select id='client_name' className='p-2 border-[1px] border-gray-300 rounded w-full'>
                      <option value="">Selecione o cliente...</option>
                      {clients.map(cli => (
                        <option key={cli.id} value={cli.name}>{cli.name}</option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className='font-semibold'>Produto:</label>
                  <select id='product_id' onChange={handleSelectProduct} className='p-2 border-[1px] border-gray-300 rounded w-full'>
                    <option value="">Selecione o produto...</option>
                    {stocks.map(pro => (
                      <option key={pro.id} value={String(pro.id)}>{pro.product_name} ({pro.amount})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='font-semibold'>Quantidade:</label>
                  <Input id='amount' placeholder="0" onBlur={handleUpdatePrice} />
                </div>

                <div className='flex flex-row gap-2'>
                  <label className='font-semibold'>Preço:</label>
                  <span className='text-md'>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(price)}</span>
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <label className='font-semibold'>
                      Está pago?
                    </label>
                    <span className='ml-4'>
                      {isPay ? "Sim" : "Não"}
                    </span>
                  </div>
                  <Switch
                    checked={isPay}
                    onCheckedChange={setIsPay}
                    onClick={handleChangeSales}
                  />
                </div>

                <div className='flex flex-row justify-end gap-2'>
                  <DialogClose>
                    <Button type='button' variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button type='submit'>Salvar</Button>
                </div>
              </form>
          </DialogContent>

        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='font-bold text-md'>Data</TableHead>
            <TableHead className='font-bold text-md'>Cliente</TableHead>
            <TableHead className='font-bold text-md'>Produto</TableHead>
            <TableHead className='font-bold text-md w-20'>Quant.</TableHead>
            <TableHead className='font-bold text-md w-24 text-center'>Preço</TableHead>
            <TableHead className='font-bold text-md w-20 text-center'>Pgto</TableHead>
            <TableHead className='font-bold text-md w-24'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>{sale.datetransaction}</TableCell>
              <TableCell>{sale.client_name}</TableCell>
              <TableCell>{sale.product_name}</TableCell>
              <TableCell className='text-right'>{sale.amount}</TableCell>
              <TableCell className='text-right'>
                {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(sale.price)}
              </TableCell>
              <TableCell className='text-center'>{sale.ispaid?'Sim':'Não'}</TableCell>
              <TableCell className='w-32 text-center'>
                <button onClick={() => handleDelete(sale.id)}>
                  <Trash2 className='w-4 h-4' /></button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} className="text-right">
              Total: {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'})
                          .format(sales.reduce((accumulator, currentItem) => {
                      return accumulator + currentItem.price;
                     }, 0))}
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

