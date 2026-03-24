export interface Cart {
  id: string;
  clientId: string;
  totalPrice: number;
  items: CartItem[];
}

export interface CartItem {
  sku: string;
  quantity: number;
  price: number;
  total: number;
  productReserve: number;
}

export interface AddItemInput {
  sku: string;
  quantity: number;
}
