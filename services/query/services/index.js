"use strict";
const Queries = require('../models/queries')

exports.getQueries = async (query) => {
  let search = {};
  if (query.brand) {
    search.brand = query.brand;
  }
  if (query.category) {
    search.category = query.category;
  }
  if (query.rating) {
    search.rating = query.rating;
  }
  if (query.seller) {
    search.seller = query.seller;
  }
  if (query.minprice) {
    search.minprice = query.minprice;
  }
  if (query.maxprice) {
    search.maxprice = query.maxprice;
  }
  if (query.sortby) {
    search.sortby = query.sortby;
  }
  if (query.sorttype) {
    search.sorttype = query.sorttype;
  }
  if (query.query) {
    search.$text = { $search: query.query };
  }
  return Queries.find(search);
}

exports.getQuery = async id => {
  return Queries.findById(id);
}

exports.createQuery = async values => {
  return Queries.create(values);
}

