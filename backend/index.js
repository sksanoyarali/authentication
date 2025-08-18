import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import cors from 'cors'
import dbConnect from './src/utils/db.js'

import userRouter from './src/routes/user.routes.js'
dotenv.config() //if not in root you can
const app = express()
const port = process.env.PORT || 3000

app.use(
  cors({
    origin: 'http://localhost:3000', //your fontend url
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Contend-Type', 'Authorization'],
  })
)
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
dbConnect()
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/api/v1/users', userRouter)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
