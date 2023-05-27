import React from 'react'
import { Sidebar } from './Sidebar'
import Image from 'next/image'
import logo from '../images/logo.png'
import { ArrowRight, BellDot, Home } from 'lucide-react'
import { Bell } from 'lucide-react'
import { useRouter } from 'next/router'


interface IDashboardLayoutProps {
  children: React.ReactNode
}

export const DashboardLayout = ({ children }: IDashboardLayoutProps) => {
  
  const router = useRouter()

  return (
    <div className="w-full h-screen bg-gray-100 p-5">
      <div className="w-full h-full rounded-tl-[2.5rem] rounded-tr-[2.5rem] flex flex-col shadow-lg border-white">

        <div className='w-full h-20 rounded-tl-[2.5rem] bg-blue-500 border-b border-white 
        rounded-tr-[2.5rem] flex items-center justify-around text-white'>

          <Image src={logo} alt='logo' height={100} width={100} />
          <h1 className='text-2xl font-bold'>Painel de administrador</h1>
          <div className='flex gap-5 items-center justify-center relative'>

          </div>
        </div>

        <div className="w-full h-full flex">

          <div className="h-full w-60 border-r border-zinc-300">
            <Sidebar />
          </div>

          <div className="w-full h-full bg-white">
            {children}
          </div>

        </div>

      </div>
    </div >
  )
}
