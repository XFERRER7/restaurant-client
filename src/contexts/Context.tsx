import { IContextItem } from "@/@types/extendedTypes"
import { IItem, IUser } from "@/@types/types"
import { api } from "@/lib/axios"
import { UserSchema } from "@/pages/login/admin"
import axios from "axios"
import { useRouter } from "next/router"
import { destroyCookie } from "nookies"
import { ReactNode, createContext, useEffect, useState } from "react"
import { toast } from "react-toastify"
import uuid from "react-uuid"

interface IContext {
  itemsCart: IContextItem[]
  notifications: INotification[]
  userType: string
  user: IUser | null
  login: (dataForm: UserSchema, userType: string) => void
  addItemToCart: (item: IContextItem) => void
  removeItemFromCart: (item: IContextItem) => void
  increaseItemQuantity: (item: IContextItem) => void
  decreaseItemQuantity: (item: IContextItem) => void
  clearCart: () => void
  addNotification: (notification: INotification) => void
  logOut: () => void
}

interface INotification {
  id: number
  message: string
}

interface IContextProps {
  children: ReactNode
}

export const ItemsContext = createContext({} as IContext)


export const Context = ({ children }: IContextProps) => {

  const [user, setUser] = useState<IUser | null>(null)
  const [itemsCart, setItemsCart] = useState<IContextItem[]>([])
  const [notifications, setNotifications] = useState<INotification[]>([])
  const [userType, setUserType] = useState<string>('')
  const router = useRouter()

  //Functions

  async function login(dataForm: UserSchema, userType: string) {

    try {

      let response = null
      if (userType == 'client') {
        response = await api.post('client/authenticate', dataForm)
      }
      else {
        response = await api.post('admin/authenticate', dataForm)
      }

      const data = response.data

      const createdUser: IUser = {
        id: data.id,
        name: data.name,
        email: data.email,
        type: userType
      }

      if (data.id) {

        const token = uuid()

        try {
          const response = await axios.post(`http://localhost:3000/api/cookies/set`,
            { token, userType: userType })
          const data = response.data

          if (data.token == token) {
            setUser(createdUser)
            window.localStorage.setItem('user', JSON.stringify(createdUser))
            router.push('/')
          }

        }
        catch (error) {
          setUser(null)
        }
      }

    }
    catch (error) {
      toast.error('Usuário ou senha inválidos')
    }

  }

  function logOut() {

    setItemsCart([])
    window.localStorage.removeItem('itemsCart')

    setUser(null)
    window.localStorage.removeItem('user')

    window.localStorage.removeItem('numberOfOrders')

    destroyCookie(null, 'token', {
      path: '/',
    })

    destroyCookie(null, 'userType', {
      path: '/',
    })

    router.push('/login/client')

  }

  function addItemToCart(item: IContextItem) {
    setItemsCart([...itemsCart, item])
    window.localStorage.setItem('itemsCart', JSON.stringify([...itemsCart, item]))
  }

  function removeItemFromCart(item: IContextItem) {
    const newItemsCart = itemsCart.filter(itemCart => itemCart.id !== item.id)
    setItemsCart(newItemsCart)
    window.localStorage.setItem('itemsCart', JSON.stringify(newItemsCart))
  }

  function increaseItemQuantity(item: IContextItem) {
    const newItemsCart = itemsCart.map(itemCart => {
      if (itemCart.id === item.id) {
        return {
          ...itemCart,
          quantityInCart: itemCart.quantityInCart + 1
        }
      }
      return itemCart
    })
    setItemsCart(newItemsCart)
    window.localStorage.setItem('itemsCart', JSON.stringify(newItemsCart))
  }

  function decreaseItemQuantity(item: IContextItem) {
    const newItemsCart = itemsCart.map(itemCart => {
      if (itemCart.id === item.id) {
        return {
          ...itemCart,
          quantityInCart: itemCart.quantityInCart - 1
        }
      }
      return itemCart
    })
    setItemsCart(newItemsCart)
    window.localStorage.setItem('itemsCart', JSON.stringify(newItemsCart))
  }

  function addNotification(notification: INotification) {

    setNotifications(state => [...state, notification])

  }

  function clearCart() {
    setItemsCart([])
    window.localStorage.removeItem('itemsCart')
  }


  //Effects

  useEffect(() => {

    const itemsCart = window.localStorage.getItem('itemsCart')

    if (itemsCart) {
      setItemsCart(JSON.parse(itemsCart))
    }

    const user = window.localStorage.getItem('user')
    setUser(user ? JSON.parse(user) : null)

    const userType = window.localStorage.getItem('userType')
    setUserType(userType || '')

  }, [])



  return (
    <ItemsContext.Provider value={{
      itemsCart, addItemToCart, removeItemFromCart,
      increaseItemQuantity, decreaseItemQuantity,
      clearCart, addNotification, notifications, userType, logOut, login, user
    }}>
      {children}
    </ItemsContext.Provider>
  )
}
