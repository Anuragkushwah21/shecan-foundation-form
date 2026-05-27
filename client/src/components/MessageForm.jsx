// src/components/MessageForm.jsx
import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

// optional: env se base URL lo
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001/api'

if (!import.meta.env.VITE_API_URL) {
  console.warn(
    '[MessageForm] VITE_API_URL not set, falling back to http://localhost:4001/api'
  )
}

const initialState = {
  name: '',
  email: '',
  message: '',
}

const MessageForm = () => {
  const [formData, setFormData] = useState(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ✅ token lene ke liye
  const { token, user } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return 'Please fill all fields.'
    }
    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(formData.email.trim())) {
      return 'Please enter a valid email address.'
    }
    if (formData.message.trim().length < 5) {
      return 'Message must be at least 5 characters.'
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // ✅ agar user logged in hi nahi hai
    if (!token || !user) {
      toast.error('Please login to send a message.')
      return
    }

    const error = validate()
    if (error) {
      toast.error(error)
      return
    }

    try {
      setIsSubmitting(true)

      const res = await toast.promise(
        axios.post(
          `${API_BASE_URL}/message`,
          {
            name: formData.name,
            email: formData.email,
            message: formData.message,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ IMPORTANT
              'Content-Type': 'application/json',
            },
          }
        ),
        {
          pending: 'Submitting...',
          success: 'Form Submitted Successfully',
          error: 'Failed to submit. Please try again.',
        }
      )

      if (res.data && res.data.message) {
        console.log('API response:', res.data)
        // toast.success(res.data.message) // already success toast aa chuka hai
      }

      setFormData(initialState)
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong. Please try again.'
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          className="w-full rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm outline-none
                     focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className="w-full rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm outline-none
                     focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          placeholder="Your message for She Can Foundation"
          className="w-full rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm outline-none
                     focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition resize-y"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center rounded-full bg-gradient-to-r
                   from-rose-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white
                   shadow-md hover:shadow-lg hover:from-rose-600 hover:to-violet-600
                   disabled:opacity-70 disabled:cursor-not-allowed transition"
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}

export default MessageForm