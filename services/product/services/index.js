const Product = require('../models/products')
const axios = require('axios');
const { Query } = require('mongoose');

const KONG_PROXY_HOST = process.env.KONG_PROXY_HOST || 'kong-proxy.kong.svc.cluster.local';
const KONG_PROXY_PORT = process.env.KONG_PROXY_PORT || 80;
exports.logQuery = async query => {

  var storeQuery = {
    queryString: query.query,
    rating: query.rating,
    brand: query.brand,
    category: query.category,
    seller: query.seller
  }
  if (query.price) {
    var prices = query.price.split(":");
    if (prices[0]) {
      storeQuery.minPrice = prices[0];
    }
    if (prices[1]) {
      storeQuery.maxPrice = prices[1];
    }
  }
  if (query.sort) {
    var sortItems = query.sort.split(":");
    if (sortItems[0]) {
      storeQuery.sortBy = sortItems[0];
      if (sortItems[1]) {
        storeQuery.sortType = sortItems[1];
      }
    }
  }
  return axios.post(`http://${KONG_PROXY_HOST}:${KONG_PROXY_PORT}/api/queries`, storeQuery);
}

exports.getFieldCounts = async (query, field) => {
  var aggregateOpts = []
  if (query) {
    aggregateOpts.push({
      $match: {
        $text: { $search: query }
      }
    })
  } 
  aggregateOpts.push({
    $group: {
      _id: `$${field}`,
      count: { $sum: 1 }
    }
  })
  return Product.aggregate(aggregateOpts);
}

exports.getProducts = async query => {
  var search = {}
  if (query.query) {
    search.$text = { $search: query.query };
  }
  if (query.brand) {
    search.brand = query.brand;
  }
  if (query.category) {
    search.categories = query.category;
  }
  if (query.rating) {
    search.rating = { $gte: query.rating };
  }
  if (query.seller) {
    search.seller = query.seller;
  }
  if (query.price) {
    var prices = query.price.split(":");
    if (prices[0]) {
      search.currentPrice = { $gt: parseInt(prices[0]) };
    }
    if (prices[1]) {
      search.currentPrice = { $lt: parseInt(prices[1]) };
    }
  }
  console.log(search)
  let result = Product.find(search);
  if (query.sort) {
    var sortItems = query.sort.split(":");
    var sort;
    if (sortItems[0]) {
      if(sortItems[0] === "price") {
        sortItems[0] = "currentPrice";
      }
      if(!sortItems[1] || sortItems[1] === "desc") {
        sort = `'-${sortItems[0]}'`;
      }
      else {
        sort = `'${sortItems[0]}'`
      }
      console.log(sort)
      return result.sort(sort);
    }
  }
  else {
    return result;
  }
}



exports.getProduct = async id => {
  return Product.findById(id)
}

exports.createProduct = async values => {
  return Product.create(values)
}





