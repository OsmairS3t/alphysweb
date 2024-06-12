import Menu from '@aw/components/menu';
import React from 'react';

export default function Layout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <div className='h-screen w-screen flex flex-row'>
      <Menu />
      <div className="bg-slate-950 h-full flex-1 text-gray-300 p-4">
        {children}
      </div>
    </div>
  )
}