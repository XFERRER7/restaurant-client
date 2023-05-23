import { useContext, useEffect, useState } from "react"
import { z } from "zod"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/lib/axios"
import { useRouter } from "next/router"
import CurrencyInput from 'react-currency-input-field'
import { IOrder } from "@/@types/types"
import { toast } from "react-toastify"
import { ItemsContext } from "@/contexts/Context"

const formSchema = z.object({
  name: z.string().nonempty({ message: 'Nome do item é obrigatório' }),
  description: z.string().nonempty({ message: 'Descrição do item é obrigatório' }),
  price: z.string().nonempty({ message: 'Preço do item é obrigatório' }),
  quantity: z.string().nonempty({ message: 'Quantidade do item é obrigatório' }).regex(/^\d+$/, { message: 'Quantidade do item deve ser um número inteiro' }),
  type: z.string().nonempty({ message: 'Tipo do item é obrigatório' })
})

type TFormSchema = z.infer<typeof formSchema>

export default function AdminPanel() {

  const [actionSelected, setActionSelected] = useState<'items' | 'report'>('items')
  const [orders, setOrders] = useState<IOrder[]>([])
  const router = useRouter() 
  const { notifications } = useContext(ItemsContext)

  const { register, handleSubmit, reset, formState: { errors }, getValues, watch } = useForm<TFormSchema>({
    resolver: zodResolver(formSchema)
  })

  const price = watch('price')

  async function createItem(data: TFormSchema) {
    
    try {

      const response = await api.post('item/create', {
        name: data.name,
        description: data.description,
        price: (Number(data.price.replace(/R\$\s?/g, "").replace(',', '.')) * 100),
        quantity: data.quantity,
        type: data.type.toLowerCase()
      })

      const { data: item } = response

      if (item) {
        toast.success('Item adicionado com sucesso', {
          autoClose: 1000
        })
        reset()
      }

    }
    catch (error) {
      console.log(error)
    }

  }

  async function getAllOrders() {
    try {
      const response = await api.get('/order/get-all')
      const { data: orders } = response
      setOrders(orders)
    }
    catch (error) {
      console.log(error)
    }
  }

  async function getReport() {

    try {

      const response = await api.get('/order/get-report', {
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'report.pdf');
      document.body.appendChild(link);

      link.click();

      window.URL.revokeObjectURL(url);

    }
    catch (error) {
      toast.error('Erro ao gerar relatório', {
        autoClose: 1000
      })
    }


  }

  function moneyMask (value: string) {

    if(!value) return 'R$ 0,00'
    
    value = value.replace('.', '').replace(',', '').replace(/\D/g, '')

    const options = { minimumFractionDigits: 2 }
    const result = new Intl.NumberFormat('pt-BR', options).format(
      parseFloat(value) / 100
    )

    return 'R$ ' + result
  }

  useEffect(() => {
    getAllOrders()
  }, [])

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-8 bg-zinc-800">

      <div>
        <h1 className="text-3xl text-white">Painel de administração</h1>
      </div>

      {
        notifications.map((item) => {
          return (
            <div className="flex flex-col gap-5">
              <span className="text-sm text-zinc-300 text-center">
                {item.message}
              </span>
            </div>
          )
        })
      }

      <div className="flex gap-5 text-white">
        <button
          className="h-10 w-44 bg-blue-500 rounded"
          onClick={() => router.push('/')}>
          Menu
        </button>
        <button
          className="h-10 w-44 bg-blue-500 rounded"
          onClick={() => setActionSelected('items')}
        >
          Adicionar item
        </button>
        <button
          className="h-10 w-44 bg-blue-500 rounded"
          onClick={() => setActionSelected('report')}
        >
          Relatório de vendas
        </button>
      </div>

      {
        actionSelected === 'items' ? (
          <div className="flex flex-col gap-5">
            <form className="flex flex-col gap-5" onSubmit={handleSubmit(createItem)}>
              <div className="flex flex-wrap gap-5">


                <input
                  type="text"
                  placeholder="Nome do item"
                  className="h-9 w-52 bg-zinc-50 rounded p-2"
                  {...register('name')}
                />
                <input
                  type="text"
                  placeholder="Descrição do item"
                  className="h-9 w-52 bg-zinc-50 rounded p-2"
                  {...register('description')}
                />
                <input
                  type="text"
                  placeholder="Preço do item"
                  value={moneyMask(price)}
                  className="h-9 w-52 bg-zinc-50 rounded p-2"

                  {...register('price')}
                />
                <input
                  type="number"
                  placeholder="Quantidade do item"
                  className="h-9 w-52 bg-zinc-50 rounded p-2"
                  {...register('quantity')}
                />
                <select className="h-9 w-52 bg-zinc-50 rounded text-center" {...register('type')}>
                  <option value="" className="text-gray-600" disabled selected>Tipo do item</option>
                  <option value="pizza">Pizza</option>
                  <option value="lanche">Lanche</option>
                  <option value="bebida">Bebida</option>
                  <option value="drink">Drink</option>
                </select>
              </div>
              <button className="h-10 w-44 bg-blue-500 text-white rounded mx-auto">
                Adicionar item
              </button>
            </form>
            <span className="text-sm text-red-600 text-center">
              {
                errors.name?.message ||
                errors.description?.message ||
                errors.price?.message ||
                errors.quantity?.message ||
                errors.type?.message
              }
            </span>
            <div className="flex gap-5">

            </div>
          </div>

        ) : (
          <div className="flex flex-col gap-5">


            <div className="w-[40rem] h-96 bg-zinc-50">
              <table className="min-w-full text-left text-sm font-light">
                <thead className="border-b font-medium dark:border-neutral-500">
                  <tr>
                    <th scope="col" className="px-6 py-4 w-1/5">ID</th>
                    <th scope="col" className="px-6 py-4 w-1/5">Cliente</th>
                    <th scope="col" className="px-6 py-4 w-1/5">Data</th>
                    <th scope="col" className="px-6 py-4 w-1/5">Valor</th>
                    <th scope="col" className="px-6 py-4 w-1/5">N° de itens</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    orders.map(order => {
                      return (
                        <tr className="border-b dark:border-neutral-500">
                          <td
                            className="whitespace-nowrap px-6 py-4 font-medium 1/5">
                            {order.id}
                          </td>
                          <td
                            className="whitespace-nowrap px-6 py-4 1/5">
                            {order.clientName}
                          </td>
                          <td
                            className="whitespace-nowrap px-6 py-4 1/5">
                            {order.createdAt.slice(0, 10)}
                          </td>
                          <td
                            className="whitespace-nowrap px-6 py-4 1/5">
                            {(order.amount / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </td>
                          <td
                            className="whitespace-nowrap px-6 py-4 1/5">
                            {order.items.length}
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>

            <button onClick={getReport} className="h-10 w-44 bg-blue-500 rounded ml-auto">
              Gerar relatório
            </button>
          </div>
        )
      }

    </div>
  )
}