import {
  loginUser,
  registerUser,
  verifyUser,
} from '../controller/user.controller.js'

import express, { Router } from 'express'
const userRouter = express.Router()

userRouter.post('/register', registerUser)

userRouter.get('/verify/:token', verifyUser)
userRouter.post('/login', loginUser)
export default userRouter
