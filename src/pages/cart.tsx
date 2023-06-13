import { Header } from "@/components/Header"
import { Home, Minus } from "lucide-react"
import Image from "next/image"
import pizzaImg from '../images/pizza.jpg'
import bebidaImg from '../images/bebida.jpg'
import lancheImg from '../images/lanche.jpg'
import drinkImg from '../images/drink.jpg'
import { useRouter } from "next/router"
import { Plus } from "lucide-react"
import { useContext, useEffect, useState } from "react"
import { ItemsContext } from "@/contexts/Context"
import { api } from "@/lib/axios"
import { ToastContainer, toast } from "react-toastify"
import { GetServerSideProps } from "next"
import { parseCookies } from "nookies"
import ProgressBar from "@ramonak/react-progress-bar"

export default function Cart() {

  const { itemsCart, removeItemFromCart,
    increaseItemQuantity, decreaseItemQuantity, clearCart, user } = useContext(ItemsContext)
  const router = useRouter()

  const [numberOfOrders, setNumberOfOrders] = useState(0)
  const [progress, setProgress] = useState(20);

  async function createOrder() {

    const items = itemsCart.map(item => {
      return {
        itemId: item.id,
        quantity: item.quantityInCart
      }
    })

    try {

      const response = await api.post('order/create', {
        clientId: user?.id,
        items,
      })

      const { data } = response

      if (data) {
        toast.success('Pedido realizado com sucesso', {
          autoClose: 1000,
        })

        clearCart()
        setNumberOfOrders((prev) => prev + 1)
        window.localStorage.setItem('numberOfOrders', JSON.stringify(numberOfOrders + 1))
      }

    }
    catch (error: any) {
      toast.error('Erro ao criar pedido', {
        autoClose: 1000,
      })
      console.log(error)
    }

  }

  useEffect(() => {

    const numberOfOrders = window.localStorage.getItem('numberOfOrders')
    setNumberOfOrders(Number(JSON.parse(numberOfOrders || '0')))

    const interval = setInterval(() => {
      setProgress(prevProgress => (prevProgress === 20 ? 80 : 20));
    }, 1000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-100">

      <Header sectionActive="cart" />

      <div className="w-full flex justify-end px-10">

        <div className="w-1/3 h-20 flex items-center justify-center">
          <h2 className="font-bold text-2xl text-zinc-600">Detalhes do pedido</h2>
        </div>

        <div className="w-1/3 h-20 flex items-center justify-end">

          <button
            className="bg-blue-500 flex items-center p-2 rounded justify-center gap-1 text-zinc-50"
            onClick={() => router.push('/')}
          >
            <span>Menu</span>
            <Home size={18} />
          </button>

        </div>

      </div>

      <div className="w-full flex flex-col items-center justify-center px-3 pb-10">

        <div className="flex items-center justify-center w-full px-10 flex-wrap gap-5 mt-10">

          {

            itemsCart.length > 0 ? (

              itemsCart.map(item => (
                <div className="w-[33rem] h-64 rounded bg-white shadow-md overflow-hidden">

                  <div className="w-full h-48 rounded flex ">

                    <div className="w-2/5 h-full rounded">
                      <Image src={
                        item.type.toLocaleLowerCase() === 'pizza' ? pizzaImg :
                          item.type.toLocaleLowerCase() === 'bebida' ? bebidaImg :
                            item.type.toLocaleLowerCase() === 'lanche' ? lancheImg :
                              item.type.toLocaleLowerCase() === 'drink' ? drinkImg : ''
                      } alt="pizza" className="w-full h-full object-cover" width={256} height={256} />
                    </div>

                    <div className="w-3/5 p-5 flex flex-col justify-around gap-3">
                      <h3 className="font-bold text-black text-xl">{item.name}</h3>
                      <span className="text-xs text-zinc-400">{item.description}</span>
                      <span className="text-blue-500 font-semibold text-xl">
                        {(item.price / 100).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>

                  </div>

                  <div className="w-full h-14 flex justify-center items-center px-5">

                    <div className="w-1/2 h-full flex items-center">
                      <span className="text-sm text-zinc-500">
                        Unidades disponíveis: {item.quantity}
                      </span>
                    </div>

                    <div className="w-1/2 h-full flex items-center gap-2">

                      <span>
                        Quantidade:
                      </span>

                      <button
                        onClick={() => {
                          if (item.quantityInCart === 1) {
                            removeItemFromCart(item)
                            return
                          }
                          decreaseItemQuantity(item)
                        }}
                      >
                        <Minus size={22} className="cursor-pointer text-red-500 hover:scale-105 transition-all" />
                      </button>

                      <span className="text zinc-700">
                        {item.quantityInCart}
                      </span>

                      <button
                        onClick={() => {
                          increaseItemQuantity(item)
                        }}
                        disabled={item.quantityInCart === item.quantity}
                        className="disabled:opacity-50"
                      >
                        <Plus size={22} className="cursor-pointer text-blue-500 hover:scale-105 transition-all"

                        />
                      </button>

                    </div>

                  </div>

                </div>
              ))
            )
              :
              <div className="w-full h-64 flex items-center justify-center">
                <span className="text-xl text-zinc-500">Nenhum item no carrinho</span>
              </div>

          }

        </div>

        <div className="w-3/4 h-10 mt-5 flex items-center justify-center">

          <button
            className="h-10 w-40 bg-blue-600 text-white disabled:bg-gray-500"
            disabled={itemsCart.length === 0}
            onClick={createOrder}>
            Finalizar pedido
          </button>

        </div>

        {
          numberOfOrders > 0 && (
            <div className="w-full h-64 flex flex-col gap-1 items-center justify-center">

              <h4 className="text-zinc-700 text-lg mb-5 font-bold">
                {
                  numberOfOrders === 1 ? 'Você tem 1 pedido em andamento' :
                    `Você tem ${numberOfOrders} pedidos em andamento`
                }
              </h4>

              <ProgressBar
                completed={progress}
                className="w-80 shadow-md border rounded-[15px]"
                labelColor="#3b82f6"
                borderRadius="10px"
                barContainerClassName="rounded-[15px]"
                bgColor="#3b82f6"
                baseBgColor="#ffffff"
                height="20px"
                labelAlignment="center"
              />
            </div>
          )
        }

      </div>
      <ToastContainer autoClose={1000} />
    </div>
  )
}


export const getServerSideProps: GetServerSideProps = async (context: any) => {

  const cookies = parseCookies(context)
  const token = cookies.token
  const userType = cookies.userType

  if (!token) {
    return {
      redirect: {
        destination: userType === 'admin' ? '/login/admin' : '/login/client',
        permanent: false
      }
    }
  }


  return {
    props: {}
  }
}