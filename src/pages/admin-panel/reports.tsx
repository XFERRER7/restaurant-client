import { IOrder } from "@/@types/types";
import { DashboardLayout } from "@/components/DashboardLayout";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";


export default function Reports() {

  const [orders, setOrders] = useState<IOrder[]>([])

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


  useEffect(() => {
    getAllOrders()
  }, [])

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col items-center gap-10 mt-10">

        <h3 className="font-bold text-xl">
          Pedidos
        </h3>

        <div className="w-[40rem] h-96 bg-zinc-50 flex flex-col items-center">
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
          <button
            className="h-10 w-44 bg-blue-500 text-white mx-auto rounded ml-auto mt-5"
            onClick={getReport}
          >
            Gerar relatório
          </button>
        </div>

      </div>
    </DashboardLayout>
  )
}