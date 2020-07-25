'use strict'
const services = require('../services')
const logger = require('../logger')

exports.getViews = async ctx => {
  logger.info(`getViews: request params ${JSON.stringify(ctx.request.query)}`)
  ctx.body = await services.getViews(ctx.request.query)
}

exports.getView = async ctx => {
  const id = ctx.params.id
  let view
  try {
    view = await services.getView(id)
  } catch (e) {
    logger.error(`getView: error getting view ${e}`)
    ctx.throw(500, 'Internal error')
  }
  if (!view) {
    logger.error(`getView: View not found`)
    ctx.throw(404, 'View not found')
  }
  ctx.body = view
}

exports.updateView = async ctx => {
  const values = ctx.request.body
  logger.info(`updateView: input value ${JSON.stringify(values)}`)
  const id = ctx.params.id
  let view
  try {
    view = await services.updateView(id, values)
  } catch (e) {
    logger.error(`updateView: error updating view ${e}`)
    ctx.throw(500, 'Internal Error')
  }
  if (!view) {
    logger.error(`updateView: View not found ${id}`)
    ctx.throw(404, 'View not found')
  }
  logger.info(`updateView: result ${JSON.stringify(view)}`)
  ctx.body = view
}

exports.deleteView = async ctx => {
  const id = ctx.params.id
  let view
  try {
    view = await services.deleteView(id)
  } catch (e) {
    logger.error(`deleteView: error deleting view ${e}`)
    ctx.throw(500, 'Error deleting view')
  }
  if (!view) {
    logger.error(`deleteView: View not found ${id}`)
    ctx.throw(404, 'View not found')
  }
  logger.info(`deleteView: view deleted`)
  ctx.body = view
}

exports.createView = async ctx => {
  const values = ctx.request.body
  logger.info(`createView: input params ${JSON.stringify(values)}`)
  const newView = await services.createView(values)

  if (!newView || !newView._id) {
    logger.error(`createView: error creating view`)
    ctx.throw(500, 'Internal error')
  }
  logger.info(`createView: success`)
  ctx.body = newView
}
