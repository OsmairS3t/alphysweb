'use client'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@aw/components/ui/form';
import React from 'react';
import { PasswordInput } from '@aw/components/ui/password-input';
import { Input } from '@aw/components/ui/input';
import { Button } from '@aw/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@aw/components/ui/card';
import Image from 'next/image';
import logo from '@aw/assets/logo.png'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  email: z.string().email('O e-mail deve ser válido'),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres."})
})

export default function SignIn() {
  const router = useRouter()
  const form = useForm({ 
    resolver: zodResolver(formSchema),
      defaultValues: {
      email: "",
      password: ""
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const supabaseCli = createClientComponentClient()
      const { email, password } = values
      const { 
        error,
        data: { session }
      } = await supabaseCli.auth.signInWithPassword({
        email,
        password,
      })
      if(error) {
        alert('Ocorreu um erro ao tentar logar: '+ error)
      }
      
      if(session) {
        console.log(session)
        alert('Usuário logado com sucesso '+ session)
      }

      form.reset()
      router.replace('/')
    } catch (error) {
      console.log('SignIn', error)
    } 
  }

  return (
    <div className='pt-32'>
      <Card className="w-[600px] m-auto">
        <CardHeader className='flex justify-center items-center'>
          <CardTitle className='flex flex-col justify-center items-center'>
            <Image src={logo} width={100} height={100} alt='Alpys Chocolateria' priority={true} />
            Alpys Chocolateria
          </CardTitle>
          <CardDescription>Entre com e-mail e senha para acessar o sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <div className='flex flex-col lg:flex-row flex-wrap justify-start items-center gap-4'>
                <Button type='submit'>Entrar</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}