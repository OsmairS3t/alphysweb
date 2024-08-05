import { ITransaction } from '@aw/utils/interface';
import React from 'react';

type dataProps = {
  id: number;
  name: string;
  product: string;
  amount: number;
  price: number;
}

interface Props {
  data: ITransaction[];
}

export default function LastRecords({ data }: Props) {
  return (
    <div>
      <h2 className='text-xl font-bold text-black'>Últimas vendas:</h2>
      <ul className='mt-1 w-full h-auto overflow-auto'>
        {data.map(item => (
          <li key={item.id} className='flex flex-row flex-wrap justify-between items-center p-2'>
            <div className='flex flex-col w-24'>
              <p className='text-sm'>{item.datetransaction}</p>
            </div>
            <div className='flex flex-col flex-1'>
              <p className='font-semibold text-lg'>{item.client_name}</p>
              <p className='text-sm'>{item.product_name}</p>
            </div>
            <div className='flex flex-col'>
              <p className='text-sm'>{item.amount} ite{item.amount > 1 ? 'ns' : 'm'}</p>
              <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}