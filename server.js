const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

// Middleware
app.use(express.json())
app.use(cors())

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const statusRoutes = require('./routes/status')

// routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/status', statusRoutes)

// default route
app.get('/', (req, res) => {
  res.send('InstaThrills Backend API')
})

// database connection
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Database connected')
  app.listen(5000, () => {
    console.log('Server running')
  })
}).catch(err => {
  console.log('Database connection failed')
})
