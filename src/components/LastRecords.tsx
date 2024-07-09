import { ISale } from '@aw/utils/interface';
import React from 'react';

type dataProps = {
  id: number;
  name: string;
  product: string;
  amount: number;
  price: number;
}

interface Props {
  data: ISale[];
}

export default function LastRecords({ data }: Props) {
  return (
    <div className='w-52 lg:w-full'>
      <h2 className='text-xl font-bold text-black'>Últimas vendas:</h2>
      <ul className='mt-1'>
        {data.map(item => (
          <li key={item.id} className='flex flex-row w-full flex-wrap justify-between items-center p-2'>
            <div className='flex flex-col'>
              <p className='font-semibold text-lg'>{item.client_name}</p>
              <p className='text-sm'>{item.product_name}</p>
            </div>
            <div className='flex flex-col'>
              <p className='text-sm'>{item.amount} itens</p>
              <p>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(item.price)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}