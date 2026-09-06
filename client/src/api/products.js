import api from './client'

export async function getAllProducts() {
  const { data } = await api.get('/products')
  return data
}

export async function getProductDetails(productId) {
  const { data } = await api.get(`/products/${productId}`)
  return data
}
