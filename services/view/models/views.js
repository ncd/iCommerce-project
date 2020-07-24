'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  productid: String
}, {
  timestamps: true
})

module.exports = mongoose.model('views', schema)
