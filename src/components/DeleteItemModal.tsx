import { api } from '@/lib/axios'
import React from 'react'
import { toast } from 'react-toastify'

interface IDeleteItemModalProps {
  idItemToDelete: number
  setIsDeletingItem: React.Dispatch<React.SetStateAction<boolean>>
}

export const DeleteItemModal = ({ idItemToDelete, setIsDeletingItem }: IDeleteItemModalProps) => {

  const handleDeleteItem = async () => {
    try {

      const response = await api.delete(`item/delete/${idItemToDelete}`)

      if (response.status == 200) {
        setIsDeletingItem(false)
      }

      toast.success('Item excluído com sucesso', {
        autoClose: 1000,
      })
      
    } catch (error) {
      console.log(error)
      toast.error('Erro ao excluir item', {
        autoClose: 1000,
      })
    }
  }

  return (
    <div className='w-screen h-screen top-0 right-0 bg-black/40 fixed z-10 flex items-center justify-center'>

      <div className='w-96 h-40 rounded bg-zinc-50 flex flex-col items-center justify-center gap-2'>

        <h1>
          Tem certeza que deseja excluir este item?
        </h1>

        <div className='w-full flex justify-center gap-5 text-white'>
          <button className='w-40 py-1 bg-red-500 rounded' onClick={() => {
            setIsDeletingItem(false)
          }}>
            Cancelar
          </button>
          <button className='w-40 py-2 bg-blue-500 rounded' onClick={handleDeleteItem}>
            Confirmar
          </button>
        </div>

      </div>
    </div>
  )
}
