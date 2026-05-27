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

// app.use(cors(
//   {
//     origin: "https://hhhhhh.netlify.app",
//     credentials:true,
//   }
// ));

app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials:true,
  }
));


app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.use('/api/auth', authRoute)
app.use('/api', formRoute)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})