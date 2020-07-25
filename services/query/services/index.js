'use strict'
const mongoose = require('mongoose')
const logger = require('../logger')
const Queries = require('../models/queries')

exports.getQueries = async (query) => {
  const search = {}
  if (query.brand) {
    search.brand = query.brand
  }
  if (query.category) {
    search.category = query.category
  }
  if (query.rating) {
    search.rating = query.rating
  }
  if (query.seller) {
    search.seller = query.seller
  }
  if (query.minprice) {
    search.minprice = query.minprice
  }
  if (query.maxprice) {
    search.maxprice = query.maxprice
  }
  if (query.sortby) {
    search.sortby = query.sortby
  }
  if (query.sorttype) {
    search.sorttype = query.sorttype
  }
  if (query.query) {
    search.$text = { $search: query.query }
  }
  logger.info(`searchQueries: query ${JSON.stringify(query)}`)
  return Queries.find(search)
}

exports.getQuery = async id => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.info(`getQuery: invalid ObjectId ${id}`)
    return null
  }
  return Queries.findById(id)
}

exports.updateQuery = async (id, values) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.info(`updateQuery: invalid ObjectId ${id}`)
    return null
  }
  logger.info(`updateQuery: query to update ${JSON.stringify(values)}`)
  const updatedQuery = await Queries.findByIdAndUpdate(id, values)
  if (updatedQuery) {
    logger.info(`updateQuery: save updatedQuery`)
    await updatedQuery.save()
  }
  return updatedQuery
}

exports.deleteQuery = async id => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.info(`deleteQuery: invalid ObjectId ${id}`)
    return null
  }
  return Queries.findByIdAndDelete(id)
}

exports.createQuery = async values => {
  logger.info(`createQuery: input values ${JSON.stringify(values)}`)
  return Queries.create(values)
}
