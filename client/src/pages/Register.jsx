// src/pages/RegisterPage.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

const RegisterPage = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      return 'Please fill all fields.'
    }
    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(form.email.trim())) {
      return 'Please enter a valid email address.'
    }
    if (form.password.length < 6) {
      return 'Password must be at least 6 characters.'
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const error = validate()
    if (error) {
      toast.error(error)
      return
    }

    try {
      setLoading(true)
      await register(form.name, form.email, form.password)
      navigate('/contact')
    } catch (err) {
      // AuthContext ke andar hi toast.error call karo agar Axios fail ho
      console.error('Register error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-200"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-200"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-200"
            placeholder="At least 6 characters"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-full py-2 text-sm font-semibold disabled:opacity-70"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  )
}

export default RegisterPage