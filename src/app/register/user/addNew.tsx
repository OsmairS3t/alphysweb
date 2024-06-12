'use client'
import React from 'react';

interface AddUserProps {
  onclose: (isOpen: boolean) => void;
}

export default function AddNewUser({ onclose }:AddUserProps) {
  function handleClose() {
    onclose(false)
  }

  return (
    <div className='flex flex-row justify-between items-center bg-slate-300 text-slate-950 font-medium p-2'>
      <h2>Novo Usuário</h2>
      <button
        className='p-1 w-8 h-8 rounded justify-center items-center bg-red-700 hover:bg-red-800 transition-all text-white font-bold'
        onClick={handleClose}>X</button>
    </div>
  )
}