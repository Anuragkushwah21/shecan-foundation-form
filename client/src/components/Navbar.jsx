// src/components/Navbar.jsx
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = ({ mobile = false, onNavigate }) => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const linkClass = (path) =>
    `${
      mobile
        ? 'block w-full text-sm px-3 py-2 rounded-md'
        : 'inline-flex items-center justify-center text-xs sm:text-sm px-3 sm:px-3.5 py-1.5 rounded-full'
    } ${
      location.pathname === path
        ? 'bg-violet-100 text-violet-800'
        : 'text-slate-600 hover:bg-slate-100'
    }`

  const handleNav = (callback) => {
    if (typeof onNavigate === 'function') onNavigate()
    if (typeof callback === 'function') callback()
  }

  return (
    <nav
      className={
        mobile
          ? 'flex flex-col gap-1 bg-white border border-slate-100 rounded-lg p-2 shadow-sm'
          : 'flex flex-wrap items-center justify-end gap-2 sm:gap-2.5'
      }
    >
      <Link
        to="/about"
        className={linkClass('/about')}
        onClick={() => handleNav()}
      >
        About
      </Link>

      {user && (
        <Link
          to="/contact"
          className={linkClass('/contact')}
          onClick={() => handleNav()}
        >
          Contact
        </Link>
      )}

      {!user && (
        <>
          <Link
            to="/login"
            className={linkClass('/login')}
            onClick={() => handleNav()}
          >
            Login
          </Link>
          <Link
            to="/register"
            className={linkClass('/register')}
            onClick={() => handleNav()}
          >
            Register
          </Link>
        </>
      )}

      {user && (
        <>
          <Link
            to="/dashboard"
            className={linkClass('/dashboard')}
            onClick={() => handleNav()}
          >
            Dashboard
          </Link>
          <button
            onClick={() => handleNav(logout)}
            className={
              mobile
                ? 'w-full text-left text-sm px-3 py-2 rounded-md text-slate-600 hover:bg-slate-100'
                : 'inline-flex items-center justify-center text-xs sm:text-sm px-3 sm:px-3.5 py-1.5 rounded-full text-slate-600 hover:bg-slate-100'
            }
          >
            Logout
          </button>
        </>
      )}
    </nav>
  )
}

export default Navbar