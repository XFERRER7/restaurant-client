import { IItem } from '@/@types/types'
import React, { useState } from 'react'

interface IEditItemModalProps {
  setIsEditingItem: React.Dispatch<React.SetStateAction<boolean>>
  itemModal: IItem
}

export const EditItemModal = ({ itemModal, setIsEditingItem }: IEditItemModalProps) => {

  const [info, setInfo] = useState(itemModal)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(info)
  }

  return (
    <div className='w-screen h-screen top-0 right-0 bg-black/40 fixed z-10 flex items-center justify-center'>

      <div className='w-[33rem] h-96 rounded bg-zinc-50 flex flex-col py-5 px-8'>

        <div className='flex justify-between'>
          <h1 className='text-2xl font-bold'>Editar item</h1>

          <span className='text-2xl cursor-pointer'
            onClick={() => setIsEditingItem(false)}>X</span>
        </div>

        <form className='w-full h-full flex flex-col items-center justify-around pt-8'>

          <input
            type="text"
            className='h-8 w-64 rounded p-2 bg-zinc-300 text-zinc-900 text-sm'
            value={info.name}
            onChange={(e) => setInfo({ ...info, name: e.target.value })}
            placeholder='Nome do item'
          />
          <input
            type="text"
            className='h-8 w-64 rounded p-2 bg-zinc-300 text-zinc-900 text-sm'
            value={info.price}
            onChange={(e) => setInfo({ ...info, price: Number(e.target.value) })}
            placeholder='Preço do item'
          />
          <input
            type="text"
            className='h-8 w-64 rounded p-2 bg-zinc-300 text-zinc-900 text-sm'
            value={info.description}
            onChange={(e) => setInfo({ ...info, description: e.target.value })}
            placeholder='Descrição'
          />
          <select 
          className="h-9 w-64 bg-zinc-300 rounded text-center" 
          name="type"
          value={info.type}
          onChange={(e) => setInfo({ ...info, type: e.target.value })}
          >
            <option value="" className="text-gray-600" disabled selected>Tipo do item</option>
            <option value="pizza">Pizza</option>
            <option value="lanche">Lanche</option>
            <option value="bebida">Bebida</option>
            <option value="drink">Drink</option>
          </select>

          <div className='w-full flex justify-around'>
            <button
              className="bg-red-500 text-white w-28 h-9 rounded mt-5"
            >Cancelar
            </button>
            <button
              className="bg-blue-500 text-white w-28 h-9 rounded mt-5"
            >Confirmar
            </button>
          </div>

        </form>

      </div>

    </div>
  )
}
