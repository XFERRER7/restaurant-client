import { IContextItem } from "@/@types/extendedTypes"
import { IItem } from "@/@types/types"
import { useRouter } from "next/router"
import { destroyCookie } from "nookies"
import { ReactNode, createContext, useEffect, useState } from "react"

interface IContext {
  itemsCart: IContextItem[]
  notifications: INotification[]
  addItemToCart: (item: IContextItem) => void
  removeItemFromCart: (item: IContextItem) => void
  increaseItemQuantity: (item: IContextItem) => void
  decreaseItemQuantity: (item: IContextItem) => void
  clearCart: () => void
  addNotification: (notification: INotification) => void
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

  const [itemsCart, setItemsCart] = useState<IContextItem[]>([])
  const [notifications, setNotifications] = useState<INotification[]>([])
  const router = useRouter()

  //Functions

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

  function logOut() {

    setItemsCart([])
    window.localStorage.removeItem('itemsCart')

    destroyCookie(null, 'token', {
      path: '/',
    })

    destroyCookie(null, 'userType', {
      path: '/',
    })

    router.push('/login/client')

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

  }, [])



  return (
    <ItemsContext.Provider value={{
      itemsCart, addItemToCart, removeItemFromCart,
      increaseItemQuantity, decreaseItemQuantity,
      clearCart, addNotification, notifications
    }}>
      {children}
    </ItemsContext.Provider>
  )
}
