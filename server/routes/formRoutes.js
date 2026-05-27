// backend/routes/formRoutes.js
const express = require('express')
const router = express.Router()
const { createMessage, getAllMessages } = require('../controllers/formController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

// logged-in user can send message
router.post('/message', protect, createMessage)

// admin can view all messages
router.get('/messages', protect, adminOnly, getAllMessages)

module.exports = router