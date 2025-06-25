
export interface Review {
  id: number,
  text: string
}
export interface Product {
    id: number,
    image_url: string,
    title: string,
    description: string,
    price: number,
    quantity: number
}

export interface ProductsResponse {
    page: number,
    amount: number,
    total: number,
    items: Product[]
}