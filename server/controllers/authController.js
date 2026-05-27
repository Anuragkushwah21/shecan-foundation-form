// backend/controllers/authController.js
const User = require('../models/UserModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required',
      })
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      })
    }

    // ✅ Password hash yahin par karein
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user', // optional override, default user
    })

    const token = generateToken(user._id)

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    })
  } catch (error) {
    console.error('Error in registerUser:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}

// POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // ✅ Password compare yahin par karein
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    const token = generateToken(user._id)

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    })
  } catch (error) {
    console.error('Error in loginUser:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Try again!',
    })
  }
}

// GET /api/auth/me  (protected)
exports.getMe = async (req, res) => {
  try {
    const user = req.user // protect middleware set karega
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'User details found',
      data: user,
    })
  } catch (error) {
    console.error('Error in getMe:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    })
  }
}

// POST /api/auth/logout (optional, frontend localStorage clear karega)
exports.logoutUser = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully!',
    })
  } catch (error) {
    console.error('Error in logoutUser:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}