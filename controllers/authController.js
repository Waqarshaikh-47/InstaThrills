const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// User sign up


const signup = async (req , res) => {
  try {
    const { username, email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    let user = { username, email, password: hashedPassword }
    let activeUser = await User.findOne({ email });
    if (activeUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    const newUser = new User(user)
    await newUser.save()
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET)
    res.status(201).json({ token })
  } catch (err) {
    res.status(500).json({ msg: 'Server error !!!' })
  }
}

// User login 

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(400).json({ msg: 'Invalid email' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid password' })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
    res.status(200).json({ token })
  } catch (err) {
    res.status(500).json({ msg: 'Server error !!!' })
  }
}

module.exports = {signup , login }
