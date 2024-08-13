const User = require('../models/User')
const Status = require('../models/Status')

const getStatuses = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('following')
    if(!user){
      return  res.status(500).json({ msg: 'User not found' })
    }
    const followingIds = user.following.map((follower) => {
        return follower._id
    })

    const statuses = await Status.find({ user: { $in: followingIds } }).populate('user', 'username').populate('comments.user', 'username').sort({ createdAt: -1 })  

    res.status(200).json({ statuses })
  } catch (error) {
    res.status(500).json({ msg: 'Server error !!!' })
  }
}

const commentOnStatus = async (req, res) => {
  try {
    const status = await Status.findById(req.params.id)
    if (!status) {
        return res.status(404).json({ msg: 'Status not found' })
    }
    const comment = { user: req.userId, text: req.body.text }
    status.comments.push(comment)

    await status.save()

    res.status(201).json({ status })
  } catch (error) {
    res.status(500).json({ msg: 'Server error !!!' })
  }
}

const likeStatus = async (req, res) => {
  try {
    const status = await Status.findById(req.params.id)
    if (!status) {
        return res.status(404).json({ msg: 'Status not found' })
    }

    if (status.likes.includes(req.userId)) {
      return res.status(400).json({ msg: 'Already liked' })
    }

    status.likes.push(req.userId)
    await status.save()

    res.status(200).json({ status })
  } catch (error) {
    res.status(500).json({ msg: 'Server error !!!' })
  }
}

const uploadStatus = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if(!user){
      return  res.status(500).json({ msg: 'User not found' })
    }
    const { text } = req.body
    const attachments = req.files.map(file => file.path)

    const newStatus = new Status({
      user: req.userId,
      text,
      attachments
    })

    await newStatus.save()
    
    user.statuses.push(newStatus)
    await user.save()

    res.status(201).json({ status: newStatus })
  } catch (error) {
    res.status(500).json({ msg: 'Server error !!!' })
  }
}


module.exports = { getStatuses, commentOnStatus, likeStatus, uploadStatus }