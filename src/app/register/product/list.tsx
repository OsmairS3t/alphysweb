'use client'
import React, { useEffect, useState } from 'react';
import { ICategory, IProduct } from '@aw/utils/interface';
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
import FormProduct from './frmProduct';
import { DialogDescription } from '@radix-ui/react-dialog';

const formSchema = z.object({
  categoryname: z.string({
    required_error: "Informe uma categoria",
  }),
  name: z.string().min(2, {
    message: "O nome do produto deve ter ao menos 2 caracteres.",
  }),
  price: z.string().min(1, {
    message: "É necessário informar o preço.",
  }),
  photo: z.string(),
})

export default function ListProduct() {
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState<ICategory[]>([])
  const [products, setProducts] = useState<IProduct[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [frmProduct, setFrmProduct] = useState<IProduct>(
    {
    id: '',
    categoryname: '',
    name: '',
    price: 0,
    photo: '',
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryname: "",
      name: "",
      price: "",
      photo: "",
    },
  })

  async function getCategories() {
    const { data } = await supabase.from('categories').select('*').order('name')
    if (data) {
      setCategories(data)
    }
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  async function getProducts() {
    const { data } = await supabase
      .from('products').select('id, categoryname, name, price, photo')
    if (data) {
      setProducts(data)
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await supabase.from('products').delete().eq('id', id)
        alert('Produto excluido com sucesso!')
        getProducts()
      } catch (error) {
        console.log(error)
      }
    }
  }
  
  async function loadProduct(id: string) {
    const { data } = await supabase.from('products').select('*').eq('id', id)
    if(data) {
      setFrmProduct(data[0])
    }
    setDialogOpen(true)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await supabase.from('products').insert({
        categoryname: values.categoryname,
        name: values.name,
        price: Number(values.price),
        photo: values.photo
      })
      alert('Produto incluído com sucesso!')
      form.reset()
      getProducts()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getCategories()
    getProducts()
  }, [])

  return (
    <div>
      <h2 className='p-2 text-lg font-semibold my-2'>Cadastro de Produtos</h2>
      <div className='flex items-center justify-between gap-4 mb-4'>
        <form className='flex flex-row gap-2'>
          <Input name="search" id='search' placeholder='Localizar' />
          <Button type='submit' variant="outline">
            <Search className='w-4 h-4 mr-2' onClick={() => getProducts()} />Buscar</Button>
        </form>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">
              <PlusCircle className='w-4 h-4 mr-2' />Novo Produto</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogDescription></DialogDescription>
            <DialogHeader>
              <DialogTitle>Novo Produto</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="categoryname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
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
                  name="photo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Foto do produto:</FormLabel>
                      <FormControl>
                        <Input placeholder="..." {...field} />
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
            
            <FormProduct frmPro={frmProduct} onCloseDialog={setDialogOpen} updateList={getProducts} />
          </DialogContent>
        </Dialog> 
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='font-bold text-md w-52'>Categoria</TableHead>
            <TableHead className='font-bold text-md'>Produto</TableHead>
            <TableHead className='font-bold text-md text-center'>Preço</TableHead>
            <TableHead className='font-bold text-md text-center'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((pro) => (
            <TableRow key={pro.id}>
              <TableCell>{pro.categoryname}</TableCell>
              <TableCell>{pro.name}</TableCell>
              <TableCell className='text-center'>
                {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                  .format(pro.price)}
              </TableCell>
              <TableCell width={30}><button onClick={() => loadProduct(pro.id)}><Edit2 className='w-4 h-4' /></button></TableCell>
              <TableCell width={30}><button onClick={() => handleDelete(String(pro.id))}><Trash2 className='w-4 h-4' /></button></TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} className="text-right">Total: {products.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
