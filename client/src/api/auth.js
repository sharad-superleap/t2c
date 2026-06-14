import api from './client'

export async function registerUser(userData) {
  const { data } = await api.post('/users/', userData)
  return data
}

export async function loginUser(credentials) {
  const { data } = await api.post('/users/login', credentials)
  return data
}

export async function getLoggedInUser() {
  const { data } = await api.get('/users/me')
  return data
}

export async function updateUser(updates) {
  const { data } = await api.patch('/users/me', updates)
  return data
}
