'use client'
import React from 'react';

interface HeaderProps {
  title: string;
  onAddClick: () => void;
  onFilterClick: () => void;
}

export default function HeaderPage({ title, onAddClick, onFilterClick }:HeaderProps) {
  return (
    <section className='flex flex-row justify-between items-center'>
    <div className='text-lg'>{title}</div>
    <div className='flex flex-row justify-end items-center gap-2'>
      <button 
        onClick={onFilterClick}
        className='p-2 rounded bg-slate-400 hover:bg-slate-500 transition-all justify-center items-center text-slate-950 font-bold'
      >
        Filtrar
      </button>
      <button
        onClick={onAddClick}
        className='p-2 rounded bg-green-400 hover:bg-green-500 transition-all justify-center items-center text-slate-950 font-bold'
      >
        Novo
      </button>
    </div>
  </section>
)
}