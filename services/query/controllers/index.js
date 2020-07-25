'use strict'
const services = require('../services')
const logger = require('../logger')

exports.getQueries = async ctx => {
  try {
    logger.info(`getQueries: params ${JSON.stringify(ctx.request.query)}`)
    ctx.body = await services.getQueries(ctx.request.query)
  } catch (e) {
    logger.error(`getQueries: Error getting queries ${e}`)
    ctx.throw(500, 'Internal error')
  }
}

exports.getQuery = async ctx => {
  const id = ctx.params.id
  let query
  try {
    query = await services.getQuery(id)
  } catch (e) {
    logger.error(`getQuery: Error getting query ${e}`)
    ctx.throw(500, 'Internal error')
  }
  if (!query) {
    logger.error(`getQuery: Query not found`)
    ctx.throw(404, 'Query not found')
  }
  logger.info(`getQuery: result ${JSON.stringify(query)}`)
  ctx.body = query
}

exports.updateQuery = async ctx => {
  const values = ctx.request.body
  logger.info(`updateQuery: request body ${JSON.stringify(values)}`)
  const id = ctx.params.id
  let query
  try {
    query = await services.updateQuery(id, values)
  } catch (e) {
    logger.error(`updateQuery: Error getting query ${e}`)
    ctx.throw(500, 'Internal Error')
  }
  if (!query) {
    logger.error(`updateQuery: Query not found`)
    ctx.throw(404, 'Query not found')
  }
  logger.info(`updateQuery: result ${query}`)
  ctx.body = query
}

exports.deleteQuery = async ctx => {
  const id = ctx.params.id
  let query
  try {
    query = await services.deleteQuery(id)
  } catch (e) {
    logger.error(`deleteQuery: Error getting query ${e}`)
    ctx.throw(500, 'Error deleting query')
  }
  if (!query) {
    logger.error(`deleteQuery: Query not found`)
    ctx.throw(404, 'Query not found')
  }
  ctx.body = query
}

exports.createQuery = async ctx => {
  const values = ctx.request.body
  logger.info(`createQuery: request body ${JSON.stringify(values)}`)
  const newQuery = await services.createQuery(values)
  if (!newQuery || !newQuery._id) {
    logger.error(`createQuery: error`)
    ctx.throw(500, 'Internal error')
  }
  ctx.body = newQuery
}
