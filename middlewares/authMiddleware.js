const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ msg: 'Unauthorized' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch (err) {
    res.status(401).json({ msg: 'Server error !!!' })
    console.log(err)
  }
}

module.exports = { authMiddleware}