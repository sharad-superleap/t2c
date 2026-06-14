import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { loginUser as loginApi, getLoggedInUser, registerUser as registerApi } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('t2c_token')
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const data = await getLoggedInUser()
      const { password, ...safeUser } = data.user || {}
      setUser(safeUser)
    } catch {
      localStorage.removeItem('t2c_token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const login = async (email, password) => {
    const data = await loginApi({ email, password })
    localStorage.setItem('t2c_token', data.token)
    await fetchUser()
    return data
  }

  const register = async (userData) => {
    const data = await registerApi(userData)
    return data
  }

  const logout = () => {
    localStorage.removeItem('t2c_token')
    setUser(null)
  }

  const updateLocalUser = (updatedUser) => {
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, fetchUser, updateLocalUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
