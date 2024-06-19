'use client'
import React, { ButtonHTMLAttributes } from 'react';
import { useFormStatus } from 'react-dom';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export default function Button({label, ...rest}:Props) {
  const { pending } = useFormStatus()

  return (
    <button disabled={pending}
    {...rest}
    className='p-2 rounded my-2 w-full lg:w-52 bg-orange-500 hover:bg-orange-300 disabled:bg-slate-400 disabled:text-gray-600 transition-all justify-center items-center text-slate-950 font-bold'
    >
      {pending ? 'Carregando...' : label}
    </button>
  )
}