'use client'
import React, { useEffect, useState } from 'react';
import { ICategory, IUser } from '@aw/utils/interface';
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
import { EyeOff, PlusCircle, Search, Trash2 } from 'lucide-react';
import { PasswordInput } from '@aw/components/ui/password-input';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter ao menos 2 caracteres.",
  }),
  email: z.string().email('O e-mail deve ser válido'),
  password: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
  confirmpassword: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  })
}).refine((data) => data.password === data.confirmpassword, {
  path: ['confirmpassword'],
  message: 'Senha e confirmação devem ser iguais.'
})

export default function ListUser() {
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState<IUser[]>([])
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    },
  })

  async function getUsers(name?: string) {
    if(name) {
      const {data} = await supabase.from('users').select('*').like('name', name)
      if(data) {
        setUsers(data)
      }
    } else {
      const {data} = await supabase.from('users').select('*').order('name')
      if(data) {
        setUsers(data)
      }
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await supabase.from('users').insert({ 
        name: values.name, 
        email: values.email,
        password: values.password
    })
      alert('Usuário incluído com sucesso!')
      form.reset()
      getUsers()
    } catch (error) {
      console.log(error)
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await supabase.from('users').delete().eq('id', id)
        alert('Usuário excluido com sucesso!')
        getUsers()
      } catch (error) {
        console.log(error)      
      }
    } 
  }
 
  useEffect(() => {
    getUsers()
  },[])

  return (
    <div>
      <h2 className='p-2 text-lg font-semibold my-2'>Cadastro de Usuários</h2>
      <div className='flex items-center justify-between gap-4 mb-4'>
        <form className='flex flex-row gap-2'>
          <Input name="search" id='search' placeholder='Categoria' />
          <Button type='submit' variant="outline">
            <Search className='w-4 h-4 mr-2' onClick={()=>getUsers()}/>Buscar</Button>
        </form>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">
              <PlusCircle className='w-4 h-4 mr-2' />Novo Usuário</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Usuário</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome:</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do usuário" {...field} />
                      </FormControl>
                      <FormDescription>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail:</FormLabel>
                      <FormControl>
                        <Input placeholder="nome@email.com" {...field} />
                      </FormControl>
                      <FormDescription>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha:</FormLabel>
                      <FormControl>
                        <PasswordInput placeholder='*****' {...field} />
                      </FormControl>
                      <FormDescription>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmpassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirme a Senha:</FormLabel>
                      <FormControl>
                        <PasswordInput placeholder='*****' {...field} />
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
            <TableHead colSpan={2} className='font-bold text-md'>Nome</TableHead>
            <TableHead colSpan={2} className='font-bold text-md'>E-mail</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.email}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell width={30}><button onClick={() => handleDelete(user.email)}><Trash2 className='w-4 h-4' /></button></TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3} className="text-right">Total: {users.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
     
    </div>
  )
}