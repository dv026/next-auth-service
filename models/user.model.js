const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, unique: false, required: true },
  // isActivated: { type: Boolean, default: false },
  // activationLink: { type: String  },
  // roles: { type: [String], unique: false, required: true }
})

module.exports = model('User', UserSchema)
