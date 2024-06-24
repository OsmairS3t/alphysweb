import Menu from '@aw/components/menu';
import React from 'react';

export default function Layout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <div className='h-screen w-screen flex flex-row'>
      <Menu />
      <div className="h-full flex-1 p-4 z-10 bg-white">
        {children}
      </div>
    </div>
  )
}