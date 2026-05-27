// src/pages/ContactPage.jsx
import React from 'react'
import MessageForm from '../components/MessageForm'

const ContactPage = () => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Contact Form</h2>
      <MessageForm />
    </div>
  )
}

export default ContactPage