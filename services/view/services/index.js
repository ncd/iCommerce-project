'use strict'
const mongoose = require('mongoose')
const logger = require('../logger')
const Views = require('../models/views')

exports.getViews = async (query) => {
  const search = {}
  if (query.productid) {
    search.productid = query.productid
  }
  logger.info(`getViews: query params ${JSON.stringify(search)}`)
  return Views.find(search)
}

exports.getView = async id => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.info(`getView: invalid ObjectId ${id}`)
    return null
  }
  return Views.findById(id)
}

exports.updateView = async (id, values) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.info(`updateView: invalid objectid ${id}`)
    return null
  }
  logger.info(`updateView: input params ${JSON.stringify(values)}`)
  const updatedView = await Views.findByIdAndUpdate(id, values)
  if (updatedView) {
    logger.info(`updateView: save view`)
    await updatedView.save()
  }
  return updatedView
}

exports.deleteView = async id => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.info(`deleteView: invalid object id ${id}`)
    return null
  }
  return Views.findByIdAndDelete(id)
}

exports.createView = async values => {
  logger.info(`createView: input params ${JSON.stringify(values)}`)
  return Views.create(values)
}
