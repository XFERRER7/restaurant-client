import { ItemsContext } from "@/contexts/Context"
import { api } from "@/lib/axios"
import { useRouter } from "next/router"
import { useContext } from "react"
import { toast } from "react-toastify"


export default function Cart() {

  const { itemsCart, removeItemFromCart, 
    increaseItemQuantity, decreaseItemQuantity, clearCart } = useContext(ItemsContext)
  const router = useRouter()


  async function createOrder() {

    const items = itemsCart.map(item => {
      return {
        itemId: item.id,
        quantity: item.quantityInCart
      }
    })

    const order = {
      clientId: 1,
      items
    }

    console.log(order)

    try {

      const response = await api.post('order/create', {
        clientId: 1,
        items,
      })

      const { data } = response

      if (data) {
        toast.success('Pedido criado com sucesso', {
          autoClose: 1000,
        })

        clearCart()
      }

    }
    catch (error: any) {
      toast.error('Erro ao criar pedido', {
        autoClose: 1000,
      })
      console.log(error)
    }

  }

  return (

    <div className="h-screen flex flex-col items-center justify-center gap-8 bg-zinc-800">



      <button
        className="bg-blue-600 text-white px-10 py-4 rounded"
        onClick={() => router.push('/')}

      >Voltar para o menu</button>
      <div className="flex gap-3">
        {
          itemsCart.map(item => (
            <div key={item.id} className="flex w-60 h-40 flex-col items-center justify-center bg-zinc-50 p-2 rounded">
              <span>Nome: {item.name}</span>
              <span>Preço: {(item.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              <span>Unidades dísponiveis: {item.quantity}</span>
              <span>Quantidade no pedido: {item.quantityInCart}</span>
              <div className="flex gap-1">
                <button
                  className="h-10 w-24 bg-red-500 text-white"
                  onClick={() => {
                    if (item.quantityInCart === 1) {
                      removeItemFromCart(item)
                      return
                    }
                    decreaseItemQuantity(item)
                  }}
                >
                  -
                </button>
                <button
                  className="h-10 w-24 bg-blue-500 text-white disabled:bg-gray-500"
                  onClick={() => {
                    increaseItemQuantity(item)
                  }}
                  disabled={item.quantityInCart === item.quantity}
                >
                  +
                </button>
              </div>
            </div>
          ))
        }
      </div>
      <button
        className="h-10 w-40 bg-blue-600 text-white disabled:bg-gray-500"
        disabled={itemsCart.length === 0}
        onClick={createOrder}
      >
        Finalizar pedido
      </button>

    </div>
  )
}