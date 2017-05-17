const mongoose = require('mongoose')
const { Schema } = mongoose.Schema

const UserSchema = new Schema({
  email: String,
  username: String,
  password: String
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
})

const User = mongoose.model('user', UserSchema)

module.exports = User