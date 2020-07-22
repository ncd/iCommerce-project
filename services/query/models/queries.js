"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  queryString: String,
  categories: String,
  rating: Number,
  minPrice: Number,
  maxPrice: Number,
  brand: String,
  seller: String,
  sortBy: String,
  sortType: String,
});

// schema.index({'$**': 'text'});
module.exports = mongoose.model('queries', schema);