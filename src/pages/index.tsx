import { IItem } from "@/@types/types"
import { EditItemModal } from "@/components/EditItemModal"
import { ItemsContext } from "@/contexts/Context"
import { api } from "@/lib/axios"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { parseCookies } from "nookies"
import { useContext, useEffect, useState } from "react"
import { toast } from "react-toastify"

export default function Home() {

  //States
  const [items, setItems] = useState<IItem[]>([])
  const { addItemToCart, itemsCart, addNotification, notifications } = useContext(ItemsContext)
  const [isEditingItem, setIsEditingItem] = useState(false)
  const [itemModal, setItemModal] = useState<IItem>({} as IItem)
  const typeUser = parseCookies().userType

  //Others variables 
  const router = useRouter()
  const types = items.map(item => item.type).filter((value, index, self) => self.indexOf(value) === index)

  //Functions
  const getAllItems = async () => {

    try {

      const response = await api.get('item/get-all')

      const { data } = response

      setItems(data)

    }
    catch (error) {

    }

  }

  async function handleAddItemToCart(item: IItem) {
    addItemToCart({
      ...item,
      quantityInCart: 1
    })

    toast.success('Item adicionado ao carrinho', {
      autoClose: 1000,

    })
  }

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  //Effects
  useEffect(() => {

    getAllItems()

  }, [])

  useEffect(() => {

    items.map(item => {
      if (item.quantity == 0) {

        const notificationExists = notifications.find(notification => notification.id === item.id)

        if (!notificationExists) {
          addNotification({
            id: item.id,
            message: `O item ${item.name} está sem estoque no momento`,
          })
        }

      }
    })

  }, [items])

  return (
    <div className="min-h-screen w-full bg-zinc-800 px-10 py-28">

      <div className="flex justify-center gap-5 mb-10">

        <button
          className="bg-blue-600 text-white w-52 h-10 rounded mr-5"
          onClick={() => router.push('/cart')}
        >Ir para carrinho</button>
        <button
          className="bg-blue-600 text-white w-52 h-10 rounded"
          onClick={() => router.push('/admin-panel')}
        >Painel de administrador</button>

      </div>

      <div className="w-full h-full flex flex-col gap-5 flex-wrap justify-around">

        {

          types.map(type => {
            return (
              <>
                <h1 className="font-bold text-white text-3xl text-center">{capitalizeFirstLetter(type)}</h1>
                <div className="flex gap-5 flex-wrap justify-around">
                  {
                    items.filter(item => item.type.toLocaleLowerCase() === type.toLocaleLowerCase())
                      .map((item) => {
                        if (item.quantity == 0) {
                          return
                        }

                        return (
                          <div
                            key={item.id}
                            className=""
                          >
                            <div
                              className="w-64 h-64 bg-zinc-50 p-2 flex flex-col items-center justify-center gap-8"

                            >
                              <span>ID: {item.id}</span>
                              <span>Nome: {item.name}</span>
                              <span>Descrição: {item.description}</span>
                              <span>Preço: {(item.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                              <span>{item.quantity}</span>
                            </div>

                            <div className="flex gap-1 justify-center mt-1">
                              <button
                                className="h-10 w-28 bg-blue-500 text-white disabled:bg-gray-500"
                                onClick={() => {
                                  handleAddItemToCart(item)
                                }}
                                disabled={itemsCart.find(itemCart => itemCart.id === item.id) ? true : false}
                              >{
                                  itemsCart.find(itemCart => itemCart.id === item.id) ? 'Adicionado' : 'Adicionar'
                                }</button>
                              <button
                                className="h-10 w-28 bg-yellow-700 text-white disabled:bg-gray-500"
                                onClick={() => {
                                  setItemModal(item)
                                  setIsEditingItem(!isEditingItem)
                                }}
                              >
                                Editar item
                              </button>
                            </div>
                          </div>
                        )
                      })
                  }

                </div>
              </>
            )
          })

        }

      </div>
      {
        isEditingItem && <EditItemModal
          setIsEditingItem={setIsEditingItem}
          itemModal={itemModal}
        />
      }
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {

  const cookies = parseCookies(context)
  const token = cookies.token;
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
