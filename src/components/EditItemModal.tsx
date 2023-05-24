import { IItem } from '@/@types/types'
import { XIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { api } from '@/lib/axios'

interface IEditItemModalProps {
  setIsEditingItem: React.Dispatch<React.SetStateAction<boolean>>
  itemModal: IItem
}

const formSchema = z.object({
  name: z.string().nonempty({ message: 'Nome do item é obrigatório' }),
  description: z.string().nonempty({ message: 'Descrição do item é obrigatório' }),
  price: z.string().nonempty({ message: 'Preço do item é obrigatório' }),
  quantity: z.string().nonempty({ message: 'Quantidade do item é obrigatório' }).regex(/^\d+$/, { message: 'Quantidade do item deve ser um número inteiro' }),
  type: z.string().nonempty({ message: 'Tipo do item é obrigatório' })
})

type TFormSchema = z.infer<typeof formSchema>

export const EditItemModal = ({ itemModal, setIsEditingItem }: IEditItemModalProps) => {

  const [info, setInfo] = useState(itemModal)

  const { register, handleSubmit, reset, formState: { errors }, getValues, watch,
    setValue } = useForm<TFormSchema>({
      resolver: zodResolver(formSchema)
    })

  const updateItem = async (data: TFormSchema) => {
    
    try {

      const response = await api.put('item/update', {
        id: info.id,
        name: data.name,
        description: data.description,
        price: (Number(data.price.replace(/R\$\s?/g, "").replace(',', '.')) * 100),
        quantity: data.quantity,
        type: data.type.toLowerCase()
      })

      const { data: item } = response

      if (item) {
        toast.success('Item atualizado com sucesso', {
          autoClose: 1000
        })
        reset()
        setIsEditingItem(false)
      }

    }
    catch (error) {
      console.log(error)
    }

  }

  function moneyMask(value: string) {

    if (!value) return 'R$ 0,00'

    value = value.replace('.', '').replace(',', '').replace(/\D/g, '')

    const options = { minimumFractionDigits: 2 }
    const result = new Intl.NumberFormat('pt-BR', options).format(
      parseFloat(value) / 100
    )

    return 'R$ ' + result
  }

  useEffect(() => {

    setValue('price', moneyMask(info.price.toString()))

  }, [])

  const price = watch('price')

  return (
    <div className='w-screen h-screen top-0 right-0 bg-black/40 fixed z-10 flex items-center justify-center'>

      <div className='w-[33rem] h-[33rem] rounded bg-zinc-50 flex flex-col py-5 px-8'>

        <div className='flex justify-between'>
          <h1 className='text-2xl font-bold'>Editar item</h1>

          <span className='text-2xl cursor-pointer'
            onClick={() => setIsEditingItem(false)}>
            <XIcon />
          </span>
        </div>

        <form
          onSubmit={handleSubmit(updateItem)}
          className='w-full h-full flex flex-col items-center justify-around pt-8'>

          <div className='flex justify-between gap-5'>
            <input
              type="text"
              className='h-10 w-full rounded p-2 bg-zinc-300 text-zinc-900 text-sm'
              defaultValue={info.name}
              placeholder='Nome do item'
              {...register('name')}
            />
            <input
              type="text"
              className='h-10 w-full rounded p-2 bg-zinc-300 text-zinc-900 text-sm'
              defaultValue={info.quantity}
              placeholder='Quantidade do item'
              {...register('quantity')}
            />
          </div>

          <div className='flex justify-between gap-5'>
            <input
              type="text"
              className='h-10 w-full rounded p-2 bg-zinc-300 text-zinc-900 text-sm'
              defaultValue={info.description}
              placeholder='Descrição'
              {...register('description')}
            />
            <input
              type="text"
              className='h-10 w-full rounded p-2 bg-zinc-300 text-zinc-900 text-sm'
              defaultValue={moneyMask(price)}
              value={moneyMask(price)}
              placeholder='Preço'
              {...register('price')}
            />
          </div>

          <div className=''>
            <select
              className="h-9 w-64 bg-zinc-300 rounded text-center"
              defaultValue={info.type}
              {...register('type')}
            >
              <option value="" className="text-gray-600" disabled selected>Tipo do item</option>
              <option value="pizza">Pizza</option>
              <option value="lanche">Lanche</option>
              <option value="bebida">Bebida</option>
              <option value="drink">Drink</option>
            </select>
          </div>

          <span className="text-sm text-red-600 text-center">
            {
              errors.name?.message ||
              errors.description?.message ||
              errors.price?.message ||
              errors.quantity?.message ||
              errors.type?.message
            }
          </span>

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
