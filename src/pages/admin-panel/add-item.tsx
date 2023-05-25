import { DashboardLayout } from "@/components/DashboardLayout";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/lib/axios";
import { toast } from "react-toastify";

const formSchema = z.object({
  name: z.string().nonempty({ message: 'Nome do item é obrigatório' }),
  description: z.string().nonempty({ message: 'Descrição do item é obrigatório' }),
  price: z.string().nonempty({ message: 'Preço do item é obrigatório' }),
  quantity: z.string().nonempty({ message: 'Quantidade do item é obrigatório' }).regex(/^\d+$/, { message: 'Quantidade do item deve ser um número inteiro' }),
  type: z.string().nonempty({ message: 'Tipo do item é obrigatório' })
})

type TFormSchema = z.infer<typeof formSchema>

export default function AddItem() {

  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm<TFormSchema>({
    resolver: zodResolver(formSchema)
  })

  const price = watch('price')

  function moneyMask(value: string) {

    if (!value) return 'R$ 0,00'

    value = value.replace('.', '').replace(',', '').replace(/\D/g, '')

    const options = { minimumFractionDigits: 2 }
    const result = new Intl.NumberFormat('pt-BR', options).format(
      parseFloat(value) / 100
    )

    return 'R$ ' + result
  }

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

  return (
    <DashboardLayout>

      <div className="w-full flex flex-col items-center gap-10 mt-10">

        <h3 className="font-bold text-xl">
          Items do cardápio
        </h3>
        <span className="text-sm text-red-600 text-center h-4">
          {
            errors.name?.message ||
            errors.description?.message ||
            errors.price?.message ||
            errors.quantity?.message ||
            errors.type?.message
          }
        </span>
        <form className="w-full px-14 grid grid-cols-2" onSubmit={handleSubmit(createItem)}>

          <div className="h-full w-full flex flex-col items-center gap-5 px-8">

            <input
              type="text"
              placeholder="Nome do item"
              className="h-9 w-full bg-zinc-50 rounded p-2 border border-zinc-400 text-sm"
              {...register('name')}
            />
            <input
              type="text"
              placeholder="Preço do item"
              value={moneyMask(price)}
              className="h-9 w-full bg-zinc-50 rounded p-2 border border-zinc-400 text-sm"
              {...register('price')}
            />
            <input
              type="number"
              placeholder="Quantidade do item"
              className="h-9 w-full bg-zinc-50 rounded p-2 border border-zinc-400 text-sm"
              {...register('quantity')}
            />
            <select
              className="h-9 w-full bg-zinc-50 rounded p-2 border border-zinc-400 text-sm"
              {...register('type')}>
              <option value="" className="text-gray-600" disabled selected>Tipo do item</option>
              <option value="pizza">Pizza</option>
              <option value="lanche">Lanche</option>
              <option value="bebida">Bebida</option>
              <option value="drink">Drink</option>
            </select>
            <button 
            className="h-10 w-36 bg-red-500 text-white rounded mx-auto"
            onClick={() => {
              reset()
            }}>
            Cancelar
          </button>
          </div>

          <div className="h-full w-full flex flex-col items-center gap-5 px-8">
            <textarea
              placeholder="Descrição do item"
              className="h-52 w-full bg-zinc-50 rounded p-2 border border-zinc-400 text-sm"
              {...register('description')}
            />
            <button className="h-10 w-36 bg-blue-500 text-white rounded mx-auto">
            Adicionar item
          </button>
          </div>
          
        </form>
        

      </div>


    </DashboardLayout>
  )
}