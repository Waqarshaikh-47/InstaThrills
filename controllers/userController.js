const User = require('../models/User')

const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id)
    if (!userToFollow) {
        return res.status(404).json({ msg: 'User not found' })
    }

    const user = await User.findById(req.userId)
    if (user.following.includes(userToFollow._id)) {
      return res.status(400).json({ msg: 'Already following this user' })
    }

    user.following.push(userToFollow._id)
    userToFollow.followers.push(user._id)

    await user.save()
    await userToFollow.save()

    res.status(200).json({ msg: 'followed successfully' })
  } catch (error) {
    res.status(500).json({ msg: 'Server error !!!' })
  }
}


module.exports = { followUser }