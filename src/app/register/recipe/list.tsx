'use client'
import React, { useEffect, useState } from 'react';
import { IBuy, IRecipe } from '@aw/utils/interface';
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
  nameproduct: z.string().min(2, {
    message: "O nome do produto ter ao menos 2 caracteres.",
  }),
  preparation: z.string().min(2, {
    message: "A forma de preparo deve ter ao menos 2 caracteres.",
  }),
  cooking: z.string().min(2, {
    message: "O tempo de cozimento deve ter ao menos 2 caracteres.",
  }),
})

export default function ListRecipe() {
  const [search, setSearch] = useState('')
  const [recipes, setRecipes] = useState<IRecipe[]>([])
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameproduct: "",
      preparation: "",
      cooking: "",
    },
  })

  async function getRecipes() {
    const { data } = await supabase.from('recipes').select('*')
    if (data) {
      setRecipes(data)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await supabase.from('recipes').insert({ 
        nameproduct: values.nameproduct,
        preparation: values.preparation,
        cooking: values.cooking,
      })
      alert('Receita incluída com sucesso!')
      form.reset()
      getRecipes()
    } catch (error) {
      console.log(error)
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Tem certeza que deseja excluir esta receita?")) {
      try {
        await supabase.from('recipes').delete().eq('id', id)
        alert('Receita excluida com sucesso!')
        getRecipes()
      } catch (error) {
        console.log(error)      
      }
    } 
  }
 
  useEffect(() => {
    getRecipes()
  },[])

  return (
    <div>
      <h2 className='p-2 text-lg font-semibold my-2'>Cadastro de Receitas</h2>
      <div className='flex items-center justify-between gap-4 mb-4'>
        <form className='flex flex-row gap-2'>
          <Input name="search" id='search' placeholder='Localizar' />
          <Button type='submit' variant="outline">
            <Search className='w-4 h-4 mr-2' onClick={()=>getRecipes()}/>Buscar</Button>
        </form>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">
              <PlusCircle className='w-4 h-4 mr-2' />Nova Receita</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Compra</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="nameproduct"
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
                  name="preparation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Local da compra:</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Modo de preparo" {...field} />
                      </FormControl>
                      <FormDescription>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cooking"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cozimento:</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tempo de cozimento" {...field} />
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
            <TableHead className='font-bold text-md w-32'>Preparo</TableHead>
            <TableHead className='font-bold text-md'>Cozimento</TableHead>
            <TableHead className='font-bold text-md'>Ingredientes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recipes.map((rec) => (
            <TableRow key={rec.id}>
              <TableCell>{rec.nameproduct}</TableCell>
              <TableCell>{rec.preparation}</TableCell>
              <TableCell>{rec.cooking}</TableCell>
              <TableCell width={30}><button onClick={() => handleDelete(rec.id)}><Trash2 className='w-4 h-4' /></button></TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={7} className="text-right">Total: {recipes.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}