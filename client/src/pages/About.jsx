// src/pages/AboutPage.jsx
import React from 'react'

const AboutPage = () => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-6 space-y-3">
      <h2 className="text-lg font-semibold mb-2">About She Can Foundation</h2>

      <p className="text-sm text-slate-600">
        This project is a full stack demo built for the She Can Foundation internship
        task. It demonstrates how a real-world web application can handle user
        registration, authentication, and secure communication between visitors and the
        organization. The goal is to show clean architecture, simple UI, and a clear
        flow from login to sending messages and viewing them in an admin dashboard.
      </p>

      <p className="text-sm text-slate-600">
        On the frontend, the application is built with React, Vite, Tailwind CSS,
        Axios, and React-Toastify. Users can create an account, log in, and then
        access a protected contact form. All important pages like the home view,
        about page, contact form, and dashboard share a common header, navigation bar,
        and footer so the experience feels consistent and easy to navigate.
      </p>

      <p className="text-sm text-slate-600">
        On the backend, the app uses Node.js, Express, MongoDB, and Mongoose to store
        user accounts and contact messages. Passwords are hashed using bcrypt, and
        JSON Web Tokens (JWT) are used to authenticate requests. Only logged-in users
        are allowed to submit messages, and only users with the admin role can access
        the dashboard where all submitted messages are listed in reverse chronological
        order.
      </p>

      <p className="text-sm text-slate-600">
        This small system covers many fundamentals of full stack development:
        routing, protected routes, form handling, API integration, database
        persistence, and basic role-based access control. It can be extended further
        with features like pagination, search, filters, email notifications, or a more
        advanced admin panel, but in its current form it already provides a solid,
        production-style example for the internship requirement.
      </p>
    </div>
  )
}

export default AboutPage