const mongoose = require('mongoose')
const User = require('../models/User')
const Status = require('../models/Status')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')

dotenv.config()

const seedDB = async ()=> {
  try {
    await mongoose.connect(process.env.MONGO_URI)

   await User.deleteMany({}) 
  await Status.deleteMany({}) 

  const users = []
  for (let i = 0; i < 1000; i++) {
    const hashedPassword = await bcrypt.hash('text', 10)
    const user = new User({ username: `user${i}`,
                            email: `user${i}@gmail.com`,
                            password: hashedPassword })
    users.push(user)
  }
  await User.insertMany(users)

  // adding followers to the seeeded users
  for (let i = 0; i < 1000; i++) {
    const user = users[i]
    user.following = users.slice(Math.max(0, i - 5), i).map((user) => {
        return user._id
    })
    user.followers = users.slice(i + 1, Math.min(1000, i + 6)).map((user) => {
        return user._id
    })
    // adding 5 likes and 5 comments by default here
    const statuses = []
    for (let j = 0; j < 5; j++) {
      const status = new Status({
        user: user._id,
        text: `Status ${j} by user${i}`,
        attachments: []
      })

      for (let k = 0; k < 5; k++) {
        status.likes.push(users[(i + k + 1) % 1000]._id)
        status.comments.push({
          user: users[(i + k + 1) % 1000]._id,
          text: `Comment ${k} on status ${j} by user${i}`
        })
      }
      statuses.push(status) 
      await status.save()
    }
    user.statuses = statuses
    await user.save()
  }

  console.log('Database seeded')
  mongoose.connection.close()
}
catch(err){
  console.log(err)
}
}

seedDB()
