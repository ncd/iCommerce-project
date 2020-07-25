'use strict'
const mongoose = require('mongoose')
const axios = require('axios')
const Products = require('../models/products')
const logger = require('../logger')
const KONG_PROXY_HOST = process.env.KONG_PROXY_HOST || 'kong-proxy.kong.svc.cluster.local'
const KONG_PROXY_PORT = process.env.KONG_PROXY_PORT || 80

exports.logQuery = async query => {
  const storeQuery = {
    querystring: query.query,
    rating: query.rating,
    brand: query.brand,
    category: query.category,
    seller: query.seller
  }
  if (query.price) {
    const prices = query.price.split(':')
    logger.info(`logQuery: prices info ${prices}`)
    if (prices[0]) {
      storeQuery.minprice = prices[0]
    }
    if (prices[1]) {
      storeQuery.maxprice = prices[1]
    }
  }
  if (query.sort) {
    const sortItems = query.sort.split(':')
    logger.info(`logQuery: sortItems info ${sortItems}`)
    if (sortItems[0]) {
      storeQuery.sortby = sortItems[0]
      if (sortItems[1]) {
        storeQuery.sorttype = sortItems[1]
      }
    }
  }
  logger.info(`logQuery: request body ${JSON.stringify(storeQuery)}`)
  return axios.post(`http://${KONG_PROXY_HOST}:${KONG_PROXY_PORT}/api/queries`, storeQuery)
}

exports.logView = async id => {
  const product = {
    productid: id
  }
  logger.info(`logView: request body ${JSON.stringify(product)}`)
  return axios.post(`http://${KONG_PROXY_HOST}:${KONG_PROXY_PORT}/api/views`, product)
}

exports.getFieldCounts = async (query, field) => {
  const aggregateOpts = []
  if (query) {
    aggregateOpts.push({
      $match: {
        $text: { $search: query }
      }
    })
  }
  aggregateOpts.push({
    $unwind: '$categories'
  })
  aggregateOpts.push({
    $group: {
      _id: `$${field}`,
      count: { $sum: 1 }
    }
  })

  logger.info(`getFieldCounts: aggregateOpts ${JSON.stringify(aggregateOpts)}`)
  return Products.aggregate(aggregateOpts)
}

exports.getProducts = async query => {
  const search = {}
  if (query.query) {
    search.$text = { $search: query.query }
  }
  if (query.brand) {
    search.brand = query.brand
  }
  if (query.category) {
    search.categories = query.category
  }
  if (query.rating) {
    search.rating = { $gte: query.rating }
  }
  if (query.seller) {
    search.seller = query.seller
  }
  if (query.price) {
    const prices = query.price.split(':')
    logger.info(`getProduct: Prices info ${prices}`)
    search.currentprice = {}
    if (prices[0]) {
      search.currentprice.$gt = parseInt(prices[0])
    }
    if (prices[1]) {
      search.currentprice.$lt = parseInt(prices[1])
    }
  }
  logger.info(`getProduct: search query ${JSON.stringify(search)}`)
  if (query.sort) {
    const sortItems = query.sort.split(':')
    logger.info(`getProducts: Sort info ${sortItems}`)
    if (sortItems[0]) {
      if (sortItems[0] === 'price') {
        sortItems[0] = 'currentprice'
      }
      let sort
      if (!sortItems[1] || sortItems[1] === 'desc') {
        sort = `'-${sortItems[0]}'`
      } else {
        sort = `'${sortItems[0]}'`
      }
      logger.info(`getProducts: Sort query ${sort}`)
      return Products.find(search).sort(sort)
    }
  } else {
    return Products.find(search)
  }
}

exports.getProduct = async id => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.info(`getProduct: invalid ObjectId ${id}`)
    return null
  }
  return Products.findById(id)
}

exports.updateProduct = async (id, product) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.info(`updateProduct: invalid ObjectId ${id}`)
    return null
  }
  const updatedProduct = await Products.findByIdAndUpdate(id, product)
  if (updatedProduct) {
    logger.info(`updateProduct: result ${JSON.stringify(updatedProduct)}`)
    await updatedProduct.save()
  }
  return updatedProduct
}

exports.deleteProduct = async id => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.info(`deleteProduct: invalid ObjectId ${id}`)
    return null
  }
  return Products.findByIdAndDelete(id)
}

exports.createProduct = async values => {
  logger.info(`createProduct: value ${JSON.stringify(values)}`)
  return Products.create(values)
}
