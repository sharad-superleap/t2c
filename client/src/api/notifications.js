import api from './client.js'

export async function getNotifications() {
  const { data } = await api.get('/notifications')
  return data
}

export async function markNotificationsAsRead(ids = []) {
  const { data } = await api.patch('/notifications/read', { ids })
  return data
}
