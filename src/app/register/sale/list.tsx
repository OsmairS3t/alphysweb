'use client'
import React, { useEffect, useState } from 'react';
import { ITransaction } from '@aw/utils/interface';
import { supabase } from '@aw/lib/database';
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
  DialogClose,
  DialogDescription
} from '@aw/components/ui/dialog';
import { Input } from '@aw/components/ui/input';
import { PlusCircle, Search, Trash2 } from 'lucide-react';
import { FrmSale } from './frmSale';

export default function ListSale() {
  // const [search, setSearch] = useState('')
  const [sales, setSales] = useState<ITransaction[]>([])

  async function getSales(search?: string, searchType?: string) {
    if (!searchType) {
      const { data } = await supabase.from('transactions').select('*').eq('modality', 'sale').order('datetransaction')
      if (data) {
        setSales(data)
      }
    } else {
      if (search) {
        if (searchType === 'product') {
          const { data } = await supabase
            .from('transactions')
            .select('*')
            .eq('modality', 'sale')
            .eq('product_name', search)
            .order('datetransaction')
          if (data) {
            setSales(data)
          }
        } else {
          const { data } = await supabase
            .from('transactions')
            .select('*')
            .eq('modality', 'sale')
            .eq('client_name', search)
            .order('datetransaction')
          if (data) {
            setSales(data)
          }
        }
      }
    }
  }

  async function handleDelete(id: number) {
    let idStock = 0
    let amountSale = 0
    let amountStock = 0
    if (confirm("Tem certeza que deseja excluir esta venda?")) {
      try {
        const dataTransaction = await supabase.from('transactions').select('*').eq('id', Number(id))
        if (dataTransaction.data) { //encontre a quantidade vendida para deovlver ao estoque
          amountSale = dataTransaction.data[0].amount
          idStock = dataTransaction.data[0].stock_id
          const dataStock = await supabase.from('stocks').select('*').eq('id', idStock)
          if (dataStock.data) {  //encontre a quantidade no estoque para aumentar com o que vai ser devolvido
            amountStock = dataStock.data[0].amount
          }
          const newAmountStock = amountSale + amountStock
          await supabase.from('stocks').update({ amount: newAmountStock }).eq('id', idStock)
        }
        await supabase.from('transactions').delete().eq('id', id)
        alert('Venda excluida com sucesso!')
        getSales()
      } catch (error) {
        console.log(error)
      }
    }
  }

  async function handlePay(id: number) {
    const { data } = await supabase.from('transactions').select('*').eq('id', id)
    let productName=''
    let clientName=''
    let paid=false
    if (data) {
      productName = data[0].product_name
      clientName = data[0].client_name
      paid = data[0].ispaid
    }
    if (confirm(`Tem certeza que deseja alterar o pagamento do produto ${productName} do cliente ${clientName} ?`)) {
      try {
        await supabase.from('transactions').update({ispaid: !paid}).eq('id', id)
        getSales()
      } catch (error) {
        console.log('Erro alteração pagamento: ', error)
      }
    }
  }

  useEffect(() => {
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
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <FrmSale listUpdate={getSales} />
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
                {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.price)}
              </TableCell>
              <TableCell className='flex justify-center items-center'>
                <button onClick={() => handlePay(sale.id)} className='flex justify-center items-center border-[1px] border-slate-200 rounded px-2 py-1'>
                  {sale.ispaid ? 'Sim' : 'Não'}
                </button>
              </TableCell>
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
              Total: {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
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

