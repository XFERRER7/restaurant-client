import { IItem } from '@/@types/types'
import { api } from '@/lib/axios'
import React from 'react'
import { toast } from 'react-toastify'

interface IDeleteItemModalProps {
  itemModal: IItem
  setIsDeletingItem: React.Dispatch<React.SetStateAction<boolean>>
}

export const DeleteItemModal = ({ itemModal, setIsDeletingItem }: IDeleteItemModalProps) => {

  const handleDeleteItem = async () => {
    try {

      const response = await api.put('item/update', {
        id: itemModal.id,
        name: itemModal.name,
        description: itemModal.description,
        price: itemModal.price,
        quantity: 0,
        type: itemModal.type.toLowerCase()
      })

      const { data: item } = response

      if (item) {
        toast.success('Estoque do item foi zerado!', {
          autoClose: 1000
        })
        setIsDeletingItem(false)
      }

    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='w-screen h-screen top-0 right-0 bg-black/40 fixed z-10 flex items-center justify-center'>

      <div className='w-96 h-40 rounded bg-zinc-50 flex flex-col items-center justify-center gap-2'>

        <h1>
          Tem certeza que zerar o estoque desse item?
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
