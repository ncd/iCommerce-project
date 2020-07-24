'use strict'
const services = require('../services')

exports.getViews = async ctx => {
  ctx.body = await services.getViews(ctx.request.query)
}

exports.getView = async ctx => {
  const id = ctx.params.id
  let view
  try {
    view = await services.getView(id)
  } catch (e) {
    ctx.throw(500, 'Internal error')
  }
  if (!view) {
    ctx.throw(404, 'Query not found')
  }
  ctx.body = view
}

exports.updateView = async ctx => {
  const values = ctx.request.body
  const id = ctx.params.id
  let view
  try {
    view = await services.updateView(id, values)
  } catch (e) {
    ctx.throw(500, 'Internal Error')
  }
  if (!view) {
    ctx.throw(404, 'View not found')
  }
  ctx.body = view
}

exports.deleteView = async ctx => {
  const id = ctx.params.id
  let view
  try {
    view = await services.deleteView(id)
  } catch (e) {
    ctx.throw(500, 'Error deleting view')
  }
  if (!view) {
    ctx.throw(404, 'Query not found')
  }
  ctx.body = view
}

exports.createView = async ctx => {
  const values = ctx.request.body
  const newView = await services.createView(values)

  if (!newView || !newView._id) {
    ctx.throw(500, 'Internal error')
  }
  ctx.body = newView
}
