// src/pages/DashboardPage.jsx
import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

// TODO: prod me config se lo
const API_URL = 'http://localhost:4001/api'

const DashboardPage = () => {
  const { token, user } = useAuth()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedEmail, setSelectedEmail] = useState('all')

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/messages`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (res.data?.success) {
          setMessages(res.data.data || [])
        } else {
          toast.error(res.data.message || 'Failed to load messages')
        }
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          'Error loading messages'
        toast.error(msg)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchMessages()
    }
  }, [token])

  // derived stats
  const stats = useMemo(() => {
    if (!messages.length) {
      return {
        total: 0,
        today: 0,
        lastMessageTime: '-',
        uniqueSenders: 0,
      }
    }

    const now = new Date()
    const todayStr = now.toDateString()

    let todayCount = 0
    let lastCreated = new Date(messages[0].createdAt)
    const senderSet = new Set()

    messages.forEach((m) => {
      const created = new Date(m.createdAt)
      if (created.toDateString() === todayStr) todayCount++
      if (created > lastCreated) lastCreated = created
      senderSet.add(m.email)
    })

    return {
      total: messages.length,
      today: todayCount,
      lastMessageTime: lastCreated.toLocaleString(),
      uniqueSenders: senderSet.size,
    }
  }, [messages])

  // filter messages by search + email
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      const matchSearch =
        !search.trim() ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.message.toLowerCase().includes(search.toLowerCase())

      const matchEmail =
        selectedEmail === 'all' ? true : m.email === selectedEmail

      return matchSearch && matchEmail
    })
  }, [messages, search, selectedEmail])

  const uniqueEmails = useMemo(
    () => Array.from(new Set(messages.map((m) => m.email))),
    [messages]
  )

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
        <p className="text-sm text-slate-500">Loading messages...</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Admin Dashboard
          </h2>
          <p className="text-sm text-slate-500">
            All contact messages submitted from the She Can Foundation website.
          </p>
        </div>
        {user && (
          <div className="text-xs px-3 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
            Logged in as <span className="font-medium">{user.email}</span>
          </div>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Total Messages</p>
          <p className="text-2xl font-semibold text-slate-800">
            {stats.total}
          </p>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Today</p>
          <p className="text-2xl font-semibold text-emerald-600">
            {stats.today}
          </p>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Unique Senders</p>
          <p className="text-2xl font-semibold text-sky-600">
            {stats.uniqueSenders}
          </p>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Last Message</p>
          <p className="text-[11px] text-slate-700 leading-snug">
            {stats.lastMessageTime}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, email, or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-200"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500">Filter by email:</label>
          <select
            value={selectedEmail}
            onChange={(e) => setSelectedEmail(e.target.value)}
            className="border rounded-lg px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-violet-200"
          >
            <option value="all">All senders</option>
            {uniqueEmails.map((email) => (
              <option key={email} value={email}>
                {email}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages list */}
      <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-700">
            Messages ({filteredMessages.length})
          </h3>
        </div>

        {filteredMessages.length === 0 ? (
          <p className="text-sm text-slate-500">No messages found.</p>
        ) : (
          <ul className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {filteredMessages.map((msg) => (
              <li
                key={msg._id}
                className="border border-slate-100 rounded-lg p-3 text-sm bg-slate-50 hover:bg-slate-100 transition"
              >
                <div className="flex justify-between items-start mb-1 gap-2">
                  <div>
                    <span className="font-semibold text-slate-800 w-full">
                      {msg.name}
                    </span>
                    <div className="text-[11px] text-slate-500">
                      {msg.email}
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                  {msg.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default DashboardPage