import {
  getProfile,
  loginUser,
  logoutUser,
  registerUser,
  verifyUser,
} from '../controller/user.controller.js'

import express, { Router } from 'express'
import { isLoggedIn } from '../middlewares/auth.middleware.js'
const userRouter = express.Router()

userRouter.post('/register', registerUser)

userRouter.get('/verify/:token', verifyUser)
userRouter.post('/login', loginUser)
userRouter.get('/profile', isLoggedIn, getProfile)
userRouter.get('/logout', isLoggedIn, logoutUser)
export default userRouter
