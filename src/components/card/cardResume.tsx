import React from 'react';
import { FiPlusCircle, FiMinusCircle, FiDollarSign } from 'react-icons/fi'

interface Props {
  title?: string;
  price?: number;
  icon?: string;
  period?: string;
}

export default function CardResume({title, price, icon, period}: Props) {
  return (
    <div className='flex flex-col gap-1 p-2 w-full lg:w-60 h-24 rounded-lg border-[1px] bg-white border-slate-300 shadow-md hover:shadow-lg hover:shadow-slate-300 transition-all'>
      <div className='flex flex-row justify-between items-center'>
        <p className='text-sm'>{title}</p>
        <p className='text-sm'>
          {icon ? (
            icon === '+' ? <FiPlusCircle size={20} /> : <FiMinusCircle size={20} />
          ) : 
            <FiDollarSign size={20} />
          }
        </p>
      </div>
      <div className='text-xl font-bold'>R$ {price}</div>
      <div className='text-sm'>
        <p>{period}</p>
      </div>
    </div>
  )
}