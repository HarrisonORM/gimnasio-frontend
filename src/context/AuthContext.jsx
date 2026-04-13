import axios from 'axios'
import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setAdmin({ token })
    }
    setCargando(false)
  }, [])

  const login = async (username, password) => {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)

    const response = await axios.post('https://web-production-3281b.up.railway.app/auth/login', formData)
    const { access_token } = response.data
    localStorage.setItem('token', access_token)
    setAdmin({ token: access_token })
    return response.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, login, logout, cargando }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}