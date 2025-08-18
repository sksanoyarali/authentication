import User from '../model/user.model.js'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookieOptions } from '../utils/constant.js'
const registerUser = async (req, res) => {
  const { name, email, password } = req.body
  console.log(req.body)
  console.log('email secure', process.env.EMAIL_SECURE)
  //validate the data recieved
  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'All fileds are rquired',
    })
  }
  //   check if user already exist
  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        message: 'User already Exists',
      })
    }

    //create new user
    const newUser = await User.create({
      name,
      email,
      password,
    })

    if (!newUser) {
      return res.status(400).json({
        message: 'User Not registered',
      })
    }
    const token = crypto.randomBytes(32).toString('hex')

    newUser.verificationToken = token
    await newUser.save()
    console.log(newUser)

    // sending mail
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: newUser.email,
      subject: 'Verify Your Email',
      text: `Please Click on the following link":
    ${process.env.BASE_URL}/api/v1/users/verify/${token}`,
    }
    console.log('before sending email')
    await transporter.sendMail(mailOption)
    console.log('after sending email')
    res.status(201).json({
      message: 'User registered successfully',
      success: true,
    })
  } catch (error) {
    res.status(400).json({
      message: 'user not registered',
      success: false,
    })
  }
}
const verifyUser = async (req, res) => {
  const { token } = req.params

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid or missing token' })
  }

  try {
    const user = await User.findOne({ verificationToken: token })

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'Invalid or expired token' })
    }

    user.isVerified = true
    user.verificationToken = undefined // clear token
    await user.save()

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully. You can now log in.',
    })
  } catch (error) {
    console.error('Email verification error:', error)
    return res.status(500).json({
      success: false,
      message: 'Server error while verifying email',
    })
  }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({
      message: 'All fields are required',
      success: false,
    })
  }

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
        success: false,
      })
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password)
    if (!isPasswordMatched) {
      return res.status(401).json({
        message: 'Invalid email or password',
        success: false,
      })
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please Verify your email, then login',
      })
    }
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    })

    res.cookie('jwtToken', jwtToken, cookieOptions)

    res.status(200).json({
      success: true,
      message: 'User login succesfull',
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'User login failed',
    })
  }
}
export { registerUser, verifyUser, loginUser }
