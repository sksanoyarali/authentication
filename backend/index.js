import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import dbConnect from './src/utils/db.js'
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
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
dbConnect()
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
