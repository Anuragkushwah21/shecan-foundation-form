// backend/controllers/formController.js
const Form = require('../models/FormModel')

// POST /api/message  (protected)
const createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      })
    }

    const doc = await Form.create({
      user: req.user._id,
      name,
      email,
      message,
    })

    return res.status(201).json({
      success: true,
      message: 'Form Submitted Successfully',
      data: {
        id: doc._id,
        name: doc.name,
        email: doc.email,
        message: doc.message,
        createdAt: doc.createdAt,
      },
    })
  } catch (err) {
    console.error('Error in createMessage:', err)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}

// GET /api/messages  (admin only)
const getAllMessages = async (req, res) => {
  try {
    const messages = await Form.find().sort({ createdAt: -1 })
    return res.json({
      success: true,
      data: messages,
    })
  } catch (err) {
    console.error('Error in getAllMessages:', err)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}

module.exports = { createMessage, getAllMessages }