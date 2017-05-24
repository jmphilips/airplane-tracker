'use strict'

const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  fbID: Number,
  name: String,
})

module.exports = mongoose.model('User', userSchema)