'use strict'
const mongoose = require('mongoose')
const Views = require('../models/views')

exports.getViews = async (query) => {
  const search = {}
  if (query.productid) {
    search.productid = query.productid
  }
  return Views.find(search)
}

exports.getView = async id => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null
  }
  return Views.findById(id)
}

exports.updateView = async (id, values) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null
  }
  const updatedView = await Views.findByIdAndUpdate(id, values)
  if (updatedView) {
    await updatedView.save()
  }
  return updatedView
}

exports.deleteView = async id => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null
  }
  return Views.findByIdAndDelete(id)
}

exports.createView = async values => {
  return Views.create(values)
}
