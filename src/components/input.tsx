import React, { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement>{
  id: string;
  name: string;
  placeholder: string;
}

export default function InputText({id, name, placeholder, ...rest}: Props) {
  return (
    <input
      {...rest}
      type='text'
      id={id}
      name={name}
      placeholder={placeholder}
      className='p-2 border-[1px] rounded-md w-full lg:w-1/3 bg-gray-400 text-slate-950 placeholder:text-slate-600'
    />
  )
}