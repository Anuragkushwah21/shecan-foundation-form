// backend/server.js
const dotenv = require("dotenv");
dotenv.config({path:'./.env'});
const express = require('express')
const cors = require("cors");
const cookieParser = require("cookie-parser")
const connectDB = require('./config/db')
const authRoute = require('./routes/authRoutes')
const formRoute = require('./routes/formRoutes')

const app = express()

connectDB()

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_ORIGIN,
]

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)


app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.use('/api/auth', authRoute)
app.use('/api', formRoute)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})