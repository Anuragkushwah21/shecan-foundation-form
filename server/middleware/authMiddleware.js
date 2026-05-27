// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken')
const User = require('../models/UserModel')

exports.protect = async (req, res, next) => {
  let token = null

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token',
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      })
    }

    req.user = user
    next()
  } catch (err) {
    console.error('JWT verify error:', err)
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed',
    })
  }
}

exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next()
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied. Admins only.',
  })
}