import { Header } from "@/components/Header";
import { Edit, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import pizzaImg from '../images/pizza.jpg'
import bebidaImg from '../images/bebida.jpg'
import lancheImg from '../images/lanche.jpg'
import drinkImg from '../images/drink.jpg'
import { IItem } from "@/@types/types";
import { ItemsContext } from "@/contexts/Context";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { api } from "@/lib/axios";
import { EditItemModal } from "@/components/EditItemModal";
import { GetServerSideProps } from "next";
import { DeleteItemModal } from "@/components/DeleteItemModal";


export default function Home() {


  const handleTabSelect = (index: number) => {
    setActiveTab(index);
  }

  //States
  const [items, setItems] = useState<IItem[]>([])
  const { addItemToCart, itemsCart, addNotification, notifications } = useContext(ItemsContext)
  const [isEditingItem, setIsEditingItem] = useState(false)
  const [itemModal, setItemModal] = useState<IItem>({} as IItem)
  const [activeTab, setActiveTab] = useState(0)

  //Others variables 
  const router = useRouter()
  const types = items.filter(item => item.quantity > 0).map(item => item.type).filter((value, index, self) => self.indexOf(value) === index)
  const userType = parseCookies().userType

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

    if (isEditingItem == false) {
      getAllItems()
    }

  }, [isEditingItem])

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


  const debugItems = types.map(type => {
    return {
      type: type,
      items: items.filter(item => item.type.toLocaleLowerCase() === type.toLocaleLowerCase())
    }
  })

  return (
    <div className="min-h-screen flex flex-col bg-zinc-100">
      <Header sectionActive="home"/>

      <div className="flex-1 flex flex-col gap-8 text-zinc-700">

        <div className="w-full flex justify-end px-10">

          <div className="w-1/3 h-20 flex items-center justify-center">
            <h2 className="font-bold text-2xl text-zinc-600">Cardápio</h2>
          </div>

          <div className="w-1/3 h-20 flex items-center justify-end">

            <button
              className="bg-blue-500 flex items-center p-2 rounded justify-center gap-1 text-zinc-50"
              onClick={() => router.push('/cart')}
            >
              <span>Carrinho</span>
              <ShoppingCart />
            </button>

          </div>

        </div>

        <div className="w-full flex flex-col items-center justify-center px-3 pb-10">

          <div className="flex items-center justify-center w-[56rem]">

            <Tabs className='w-full h-full' selectedIndex={activeTab} onSelect={handleTabSelect}>

              <TabList className='flex w-full items-center justify-center gap-5 mb-10'>

                {

                  types.map(type => {
                    return (
                      <Tab
                        className='w-1/4 text-center border-b-4 cursor-pointer'
                        selectedClassName="border-blue-600 outline-none"
                      >{capitalizeFirstLetter(type)}
                      </Tab>
                    )
                  })

                }
              </TabList>

              {

                types.map(type => {

                  return items.filter(item => item.type.toLocaleLowerCase() === type.toLocaleLowerCase())
                    .map((item) => {
                      if (item.quantity == 0) {
                        return
                      }

                      return (
                        <TabPanel className='flex'>

                          <div className="flex flex-wrap gap-5 justify-center relative">

                            <div className="w-64 h-[22rem] rounded-md bg-white flex flex-col shadow-md
                             relative
                            ">
                              {
                                userType === 'admin' &&
                                <>
                                  <div
                                    className="h-12 w-12 bg-zinc-500 text-white rounded-full
                                absolute -right-5 -top-4 flex items-center justify-center cursor-pointer"
                                    onClick={() => {
                                      setItemModal(item)
                                      setIsEditingItem(!isEditingItem)
                                    }}
                                  >
                                    <Edit />
                                  </div>
                                </>
                              }

                              <div className="h-1/2">
                                <Image src={
                                  item.type.toLocaleLowerCase() === 'pizza' ? pizzaImg :
                                    item.type.toLocaleLowerCase() === 'bebida' ? bebidaImg :
                                      item.type.toLocaleLowerCase() === 'lanche' ? lancheImg :
                                        item.type.toLocaleLowerCase() === 'drink' ? drinkImg : ''
                                } alt="pizza" width={256} height={256} />
                              </div>

                              <div className="h-1/2 flex flex-col justify-around px-4 py-3">

                                <h3 className="font-bold text-black text-xl">{item.name}</h3>
                                <span className="text-xs text-zinc-400">{item.description}</span>
                                <div className="flex justify-between items-center">
                                  <span className="text-blue-500 font-semibold text-xl">{(item.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                  <button
                                    className="bg-blue-500 flex items-center p-2 rounded justify-center gap-1 text-zinc-50
                                    disabled:bg-gray-500 cursor-pointer
                                    "
                                    disabled={itemsCart.find(itemCart => itemCart.id === item.id) ? true : false}
                                    onClick={() => handleAddItemToCart(item)}
                                  >
                                    <span className="text-sm">
                                      {itemsCart.find(itemCart => itemCart.id === item.id) ? 'Adicionado' : 'Adicionar'}
                                    </span>
                                    <ShoppingCart size={18} />
                                  </button>
                                </div>

                              </div>

                            </div>


                          </div>
                        </TabPanel>
                      )

                    })

                })
              }

            </Tabs>

          </div>

        </div>

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