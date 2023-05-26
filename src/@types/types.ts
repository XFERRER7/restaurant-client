

export interface IItem {
  id: number
  name: string
  description: string
  quantity: number
  price: number
  type: string
}

export interface IOrder {
  id: number
  amount: number
  createdAt: string
  clientName: string
  items: ItemOrder[]
}

export interface ItemOrder {
  name: string
  quantity: number
}

export interface IUser {
  id: number
  name: string
  email: string
  type: string
}