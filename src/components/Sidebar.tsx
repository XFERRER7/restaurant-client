import React, { useContext, useEffect, useState } from 'react'
import { BarChart3, FileBarChart, LogOut, PlusSquare } from 'lucide-react'
import { useRouter } from 'next/router'
import { ItemsContext } from '@/contexts/Context'

export const Sidebar = () => {

  const [activePage, setActivePage] = useState<'dashboard' | 'add-item' | 'reports'>('dashboard')

  const router = useRouter()

  const { logOut, user } = useContext(ItemsContext)

  useEffect(() => {

    const path = window.location.pathname

    if (path == '/admin-panel/dashboard') {
      setActivePage('dashboard')
    }
    else if (path == '/admin-panel/add-item') {
      setActivePage('add-item')
    }
    else if (path == '/admin-panel/reports') {
      setActivePage('reports')
    }


  }, [])

  return (
    <nav className='bg-blue-500 h-full w-full text-white font-sans flex flex-col'>

      <div className="flex items-center justify-center gap-3 w-full">
        <h2 className='text-xl font-bold my-5'>
          {
            activePage == 'dashboard' ? 'Dashboard' :
              activePage == 'add-item' ? 'Adicionar itens' :
                activePage == 'reports' ? 'Relatórios' : ''
          }
        </h2>
      </div>

      <div className="w-[90%] mx-auto bg-gray-300 border-t px-5" />

      <div className='w-full h-72 flex flex-col'>

        <div className={`flex w-full h-2/4 flex-col mt-10 
        items-center justify-between px-8 ${activePage == 'dashboard' ? 'text-blue-900' : 'text-white'}`}
          onClick={() => router.push('/admin-panel/dashboard')}>
          <div className="w-full flex items-center gap-3 p-2 cursor-pointer rounded
          hover:bg-blue-800 transition-colors">
            <BarChart3 size={18} />
            <span className="font-bold "

            >
              Gerenciar itens
            </span>
          </div>
        </div>

        <div className="flex w-full h-2/4 flex-col
      items-center justify-between px-8"
          onClick={() => router.push('/admin-panel/add-item')}>
          <div className={`w-full flex items-center gap-3 p-2 cursor-pointer rounded
          hover:bg-blue-800 transition-colors ${activePage == 'add-item' ? 'text-blue-900' : 'text-white'}`}>
            <PlusSquare size={18} />
            <span className="font-bold"
            >Adicionar item</span>
          </div>
        </div>

        <div className={`flex w-full h-2/4 flex-col
        items-center justify-between px-8 ${activePage == 'reports' ? 'text-blue-900' : 'text-white'}`}
          onClick={() => router.push('/admin-panel/reports')}>
          <div className="w-full flex items-center gap-3 p-2 cursor-pointer rounded
          hover:bg-blue-800 transition-colors">
            <FileBarChart size={18} />
            <span className="font-bold"
            >
              Relatórios
            </span>
          </div>
        </div>

      </div>

      <div className="flex w-full flex-col mt-10 
      items-center justify-between px-10 cursor-pointer gap-2">

        <div className="w-full flex items-center gap-5 p-2 hover:bg-blue-800 transition-colors rounded">
          <LogOut size={18} />
          <span
            className="font-bold"
            onClick={() => logOut()}>
            Logout
          </span>
        </div>

        <div className="flex w-full gap-5">

          <div>
            <div className='flex flex-col items-center w-8 h-8 bg-white rounded-full justify-center text-sm'>
              <span className='text-green-900 font-bold text-lg uppercase'>A</span>
            </div>
          </div>

          <div className="flex w-full flex-col text-xs">
            <span>{user ? user.name : 'admin'}</span>
            <span>{user ? user.email : 'admin@gmail.com'}</span>
          </div>

        </div>

      </div>
    </nav>
  )
}
