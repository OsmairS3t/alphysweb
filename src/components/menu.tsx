'use client'
import React from 'react';
import Link from "next/link";
import { FiLayers } from "react-icons/fi";
import { FaHome, 
  FaRegListAlt, 
  FaRegUser, 
  FaCoins, 
  FaRegUserCircle, 
  FaCompressArrowsAlt, 
  FaConciergeBell, 
  FaShoppingBasket, 
  FaShippingFast, 
  FaCommentsDollar, 
  FaSignOutAlt } from "react-icons/fa";
import Image from 'next/image';

import logo from '@aw/assets/logo.png'
import { signout } from '@aw/app/login/actions'

export default function Menu() {
  function handleSignOut() {
    signout()
  }
  return (
    <nav className="flex flex-col justify-start items-start z-0 p-3 gap-10 font-normal h-full w-12 hover:w-44 transition-all md:w-44 border-[1px] border-r-gray-200">
      <Image src={logo} width={100} height={100} alt='Alpys Chocolateria' priority={true} />
      <Link href="/" className="flex flex-row gap-2 hover:text-orange-400"><FaHome size={28} />Home</Link>
      <div className="flex flex-col gap-2 mb-2">
        <div className="flex flex-row gap-2 mb-1"><FiLayers size={28} /> Cadastros</div>
        <Link href="/register/category" className="flex flex-row justify-start items-center gap-2 hover:text-orange-400 ml-4">
          <FaRegListAlt  size={14} />Categorias
        </Link>
        <Link href="/register/product" className="flex flex-row justify-start items-center gap-2 hover:text-orange-400 ml-4">
          <FaCoins  size={14} />Produtos
        </Link>
        <Link href="/register/cliente" className="flex flex-row justify-start items-center gap-2 hover:text-orange-400 ml-4">
          <FaRegUserCircle size={14} />Clientes
        </Link>
        <Link href="/register/buy" className="flex flex-row justify-start items-center gap-2 hover:text-orange-400 ml-4">
          <FaShoppingBasket size={14} />Compras
        </Link>
        <Link href="/register/sale" className="flex flex-row justify-start items-center gap-2 hover:text-orange-400 ml-4">
          <FaCommentsDollar size={14} />Vendas
        </Link>
        <Link href="/register/stock" className="flex flex-row justify-start items-center gap-2 hover:text-orange-400 ml-4">
          <FaCompressArrowsAlt size={14} />Estoque
        </Link>
        <Link href="/register/order" className="flex flex-row justify-start items-center gap-2 hover:text-orange-400 ml-4">
          <FaShippingFast size={14} />Encomendas
        </Link>
        <Link href="/register/recipe" className="flex flex-row justify-start items-center gap-2 hover:text-orange-400 ml-4">
          <FaConciergeBell size={14} />Receitas
        </Link>
        <Link href="/register/user" className="flex flex-row justify-start items-center gap-2 hover:text-orange-400 ml-4">
          <FaRegUser size={14} />Usuários
        </Link>
      </div>
      <button onClick={handleSignOut} className="flex flex-row gap-2 hover:text-orange-400"><FaSignOutAlt size={28} />Sair</button>
    </nav>
  )
}