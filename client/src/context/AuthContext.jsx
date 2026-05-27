// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('shecan_user')
    if (stored) {
      const parsed = JSON.parse(stored)
      setUser(parsed.user)
      setToken(parsed.token)
    }
    setLoading(false)
  }, [])

  const saveAuth = (userData, jwtToken) => {
    setUser(userData)
    setToken(jwtToken)
    localStorage.setItem('shecan_user', JSON.stringify({ user: userData, token: jwtToken }))
  }

  // ✅ yahi register hai jo RegisterPage use karega
  const register = async (name, email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      })

      if (!res.data?.success) {
        const msg = res.data?.message || 'Failed to register'
        toast.error(msg)
        throw new Error(msg)
      }

      const { token, ...userData } = res.data.data
      saveAuth(userData, token)
      toast.success(res.data.message || 'Registered successfully')
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Registration failed. Try again.'
      toast.error(msg)
      throw err
    }
  }

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password })

      if (!res.data?.success) {
        const msg = res.data?.message || 'Failed to login'
        toast.error(msg)
        throw new Error(msg)
      }

      const { token, ...userData } = res.data.data
      saveAuth(userData, token)
      toast.success(res.data.message || 'Login successful')
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Login failed. Try again.'
      toast.error(msg)
      throw err
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('shecan_user')
    toast.info('Logged out')
  }

  const value = { user, token, loading, register, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)