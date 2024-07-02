import React from 'react';

type dataProps = {
  id: number;
  name: string;
  product: string;
  amount: number;
  price: number;
}

interface Props {
  data: dataProps[];
}

export default function LastRecords({data}: Props) {
  return (
    <div className='w-52 lg:w-full'>
      <h2 className='text-xl font-bold text-black'>Últimas vendas:</h2>
      <ul className='mt-2'>
        {data.map(item => (
          <li key={item.id} className='flex flex-row w-full flex-wrap justify-between items-center mb-1 p-2'>
            <div className='flex flex-col'>
              <p className='font-semibold text-lg'>{item.name}</p>
              <p className='text-md'>{item.product}</p>
            </div>
            <p>R$ {item.price}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}