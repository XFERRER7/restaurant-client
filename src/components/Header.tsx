import Image from 'next/image'
import React from 'react'
import logo from '../images/logo.png'
import { LogOut, ShieldAlert, ShoppingCart } from 'lucide-react'

export const Header = () => {

  return (
    <div className='w-full h-20 bg-blue-500 flex justify-between items-center px-10 gap-5'>


      <div className=" w-1/3 h-full flex items-center justify-start">
        <Image src={logo} alt='logo' height={100} width={100} />
      </div>

      <div className=" w-1/3 h-full flex items-center justify-center">
        <h1 className='text-4xl text-white font-bold w-13 text-center'>Menu</h1>
      </div>

      <div className="w-1/3 h-full flex gap-8 text-white items-center justify-center">
        <span className='flex items-center gap-1 text-zinc-50
        hover:text-zinc-100 transition-colors cursor-pointer'>
          Painel do administrador
          <ShieldAlert />
        </span>
        
        <span className='flex items-center gap-1 text-zinc-50
        hover:text-zinc-100 transition-colors cursor-pointer'>
          Sair
          <LogOut size={20}/>
        </span>
      </div>

    </div>
  )
}
