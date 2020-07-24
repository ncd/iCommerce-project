'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  querystring: String,
  categories: String,
  rating: Number,
  minprice: Number,
  maxprice: Number,
  brand: String,
  seller: String,
  sortby: String,
  sorttype: String
}, {
  timestamps: true
})

// schema.index({'$**': 'text'});
module.exports = mongoose.model('queries', schema)
