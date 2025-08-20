import jwt from 'jsonwebtoken'
export const isLoggedIn = (req, res, next) => {
  try {
    console.log(req.cookies)
    const token = req.cookies?.jwtToken

    console.log('Token found', token ? 'yes' : 'no')
    if (!token) {
      return res.status(401).json({
        message: 'unAuthrozed access',
        success: false,
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log(decoded)
    req.user = decoded
    next()
  } catch (error) {
    console.log('Auth middlwware failure')
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}
