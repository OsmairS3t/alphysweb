import React from 'react';

interface Props {
  onClick: () => void;
  label: string;
}

export default function Button({onClick, label}:Props) {
  return (
    <button 
      onClick={onClick}
      className='p-2 rounded bg-slate-400 hover:bg-slate-500 transition-all justify-center items-center text-slate-950 font-bold'
    >
      {label}
    </button>
  )
}