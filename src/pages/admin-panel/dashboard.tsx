import { Header } from "@/components/Header";
import { Home } from "lucide-react";
import { useRouter } from "next/router";
import { DashboardLayout } from '../../components/DashboardLayout'
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { IItem } from "@/@types/types";
import { EditItemModal } from "@/components/EditItemModal";
import { DeleteItemModal } from "@/components/DeleteItemModal";

export default function AdminPanel2() {

  //States
  const [items, setItems] = useState<IItem[]>([])
  const [isEditingItem, setIsEditingItem] = useState(false)
  const [isDeletingItem, setIsDeletingItem] = useState(false)
  const [idItemToDelete, setIdItemToDelete] = useState(0)
  const [itemModal, setItemModal] = useState<IItem>({} as IItem)

  const router = useRouter()

  const getAllItems = async () => {

    try {

      const response = await api.get('item/get-all')

      const { data } = response

      setItems(data)

    }
    catch (error) {

    }

  }

  //Effects
  useEffect(() => {

    if (isEditingItem == false && isDeletingItem == false) {
      getAllItems()
    }

  }, [isEditingItem, isDeletingItem])

  return (
    <DashboardLayout>

      <div className="w-full flex flex-col items-center gap-10 mt-10">

        <h3 className="font-bold text-xl">
          Items do cardápio
        </h3>

        <div className="w-[40rem] h-96 bg-zinc-50">
          <table className="min-w-full text-left text-sm font-light">
            <thead className="border-b font-medium dark:border-neutral-500">
              <tr>
                <th scope="col" className="px-6 py-4 w-[14.28%]">Nome</th>
                <th scope="col" className="px-6 py-4 w-[14.28%]">Quantidade</th>
                <th scope="col" className="px-6 py-4 w-[14.28%]">Preço</th>
                <th scope="col" className="px-6 py-4 w-[14.28%]">Type</th>
                <th scope="col" className="px-6 py-4 w-[14.28%]">Editar</th>
                <th scope="col" className="px-6 py-4 w-[14.28%] text-center">Zerar estoque</th>
              </tr>
            </thead>
            <tbody>
              {
                items.map(item => {

                  return (
                    <tr className="border-b dark:border-neutral-500">
                      <td
                        className="whitespace-nowrap px-6 py-4 font-medium w-[14.28%]">
                        {item.name}
                      </td>
                      <td
                        className="whitespace-nowrap px-6 py-4 w-[14.28%]">
                        {item.quantity}
                      </td>
                      <td
                        className="whitespace-nowrap px-6 py-4 w-[14.28%]">
                        {(item.price / 100).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td
                        className="whitespace-nowrap px-6 py-4 w-[14.28%]">
                        {
                          item.type.slice(0, 1).toUpperCase() + item.type.slice(1)
                        }
                      </td>
                      <td
                        className="whitespace-nowrap px-6 py-4 w-[14.28%]">
                        <button
                          className="w-20 h-10 rounded bg-blue-500 text-white"
                          onClick={() => {
                            setItemModal(item)
                            setIsEditingItem(!isEditingItem)
                          }}
                        >Editar</button>
                      </td>
                      <td
                        className="whitespace-nowrap px-6 py-4 w-[14.28%]">
                        <button 
                        className="w-20 h-10 rounded bg-red-500 text-white"
                        onClick={() => {
                          setItemModal(item)
                          setIsDeletingItem(!isDeletingItem)
                        }}
                        >Zerar</button>
                      </td>
                    </tr>
                  )

                })
              }
            </tbody>
          </table>
        </div>

      </div>
      {
        isEditingItem && <EditItemModal
          setIsEditingItem={setIsEditingItem}
          itemModal={itemModal}
        />
      }
      {
        isDeletingItem && <DeleteItemModal
          setIsDeletingItem={setIsDeletingItem}
          itemModal={itemModal}
        />
      }
    </DashboardLayout>
  )
}