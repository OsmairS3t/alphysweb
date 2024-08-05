'use client'

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@aw/components/ui/card';
import Image from 'next/image';
import logo from '@aw/assets/logo.png'
import { login } from './actions';

export default function LoginPage() {

  return (
    <div className='pt-32'>
      <Card className="w-[500px] m-auto">
        <CardHeader className='flex justify-center items-center'>
          <CardTitle className='flex flex-col justify-center items-center'>
            <Image src={logo} width={100} height={100} alt='Alpys Chocolateria' priority={true} />
            Alpys Chocolateria
          </CardTitle>
          <CardDescription>Entre com e-mail e senha para acessar o sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className='flex flex-col gap-4'>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className='p-2 border-[1px] rounded-md bg-gray-300 placeholder:text-gray-900'
            />
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className='p-2 border-[1px] rounded-md bg-gray-300 placeholder:text-gray-900'
            />
            <button
              formAction={login}
              className='w-40 bg-black hover:bg-opacity-70 p-2 rounded-lg text-white'
            >
              Entrar
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}