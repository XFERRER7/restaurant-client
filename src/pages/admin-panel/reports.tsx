import { IOrder } from "@/@types/types"
import { DashboardLayout } from "@/components/DashboardLayout"
import { api } from "@/lib/axios"
import { GetServerSideProps } from "next"
import { parseCookies } from "nookies"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import ProgressBar from '@ramonak/react-progress-bar'


export default function Reports() {

  const [orders, setOrders] = useState<IOrder[]>([])
  const [orderSelected, setOrderSelected] = useState<number | null>(null)
  const [downloadProgress, setDownloadProgress] = useState({
    isDownloading: false,
    progress: 0
  })

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

      setDownloadProgress({
        isDownloading: true,
        progress: 0
      })

      const response = await api.get(`/order/get-report/${orderSelected}`, {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = ((progressEvent.loaded / progressEvent.total) * 100)
            setDownloadProgress(prev => {
              return {
                ...prev,
                progress
              }
            })
          }

        },
      })

      setDownloadProgress({
        isDownloading: false,
        progress: 0
      })

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))

      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'report.pdf')
      document.body.appendChild(link)

      link.click()

      window.URL.revokeObjectURL(url)

    }
    catch (error) {
      toast.error('Erro ao gerar relatório', {
        autoClose: 1000
      })
    }

  }


  useEffect(() => {
    getAllOrders()
  }, [])

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col items-center gap-10 mt-10 px-20 pb-3">

        <h3 className="font-bold text-xl">
          Pedidos
        </h3>

        <div className="w-full h-80 bg-zinc-50 flex flex-col items-center overflow-y-scroll shadow-md">
          <table className="min-w-full text-sm font-light text-center">
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
                    <tr className={`border-b dark:border-neutral-500 cursor-pointer ${
                      orderSelected === order.id ? 'bg-zinc-300' : ''
                    }`} onClick={() => {
                      if (orderSelected === order.id) {
                        setOrderSelected(null)
                      }
                      else {
                        setOrderSelected(order.id)
                      }
                    }}>
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
                        {order.createdAt.slice(0, 10).split('-').reverse().join('/')}
                      </td>
                      <td
                        className="whitespace-nowrap px-6 py-4 1/5">
                        {(order.amount / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td
                        className="whitespace-nowrap px-6 py-4 1/5">
                        {
                          order.items.reduce((acc, item) => {
                            return acc + item.quantity
                          }, 0)
                        }
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
        <button
          className="h-10 w-44 bg-blue-500 text-white mx-auto rounded ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={getReport}
          disabled={orderSelected === null}
        >
          {
            orderSelected === null ?
              'Selecione um pedido' :
              'Gerar relatório'
          }
        </button>

      </div>

      {
        downloadProgress.isDownloading &&
        <div className="
        fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50
        ">
          <span
            className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
            Baixando...
          </span>
        </div>
      }
    </DashboardLayout>
  )
}


export const getServerSideProps: GetServerSideProps = async (context: any) => {

  const cookies = parseCookies(context)
  const token = cookies.token
  const userType = cookies.userType

  if (userType === 'client') {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

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