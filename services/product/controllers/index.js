'use strict'

const services = require('../services')
const logger = require('../logger')

exports.getProducts = async ctx => {
  const query = ctx.request.query
  const response = {}
  try {
    [response.products, response.brands, response.ratings, response.categories, response.sellers] = await Promise.all([
      services.getProducts(ctx.request.query),
      services.getFieldCounts(query.query, 'brand'),
      services.getFieldCounts(query.query, 'rating'),
      services.getFieldCounts(query.query, 'categories'),
      services.getFieldCounts(query.query, 'seller')
    ])
  } catch (e) {
    logger.error(`getProducts: Error getting products information ${e}`)
    ctx.throw(500, 'Internal Error')
  }
  try {
    await services.logQuery(query)
  } catch (e) {
    logger.error(`getProducts: Error saving log ${e}`)
  }
  logger.info(`getProducts: result ${JSON.stringify(response)}`)
  ctx.body = response
}

exports.getProduct = async ctx => {
  const id = ctx.params.id
  let product
  try {
    product = await services.getProduct(id)
  } catch (e) {
    logger.error(`getProduct: Error getting product info ${e}`)
    ctx.throw(500, 'Internal error')
  }
  if (product === undefined || !product) {
    logger.error(`getProduct: Product not found`)
    ctx.throw(404, 'Product not found')
  }
  try {
    await services.logView(id)
  } catch (e) {
    logger.error(`getProduct: Error saving view log ${e}`)
    console.log('Error saving view log')
  }
  logger.info(`getProduct: result ${JSON.stringify(product)}`)
  ctx.body = product
}

exports.updateProduct = async ctx => {
  const values = ctx.request.body
  logger.info(`updateProducct: request body ${JSON.stringify(values)}`)
  const id = ctx.params.id
  let product
  try {
    product = await services.updateProduct(id, values)
  } catch (e) {
    logger.error(`updateProduct: Error updating product info ${e}`)
    ctx.throw(500, 'Internal error')
  }
  if (product === undefined || !product) {
    logger.error(`updateProduct: Product not found`)
    ctx.throw(404, 'Product not found')
  }
  logger.info(`updateProduct: result ${JSON.stringify(product)}`)
  ctx.body = product
}

exports.deleteProduct = async ctx => {
  const id = ctx.params.id
  let product
  try {
    product = await services.deleteProduct(id)
  } catch (e) {
    logger.error(`deleteProduct: Error deleting product ${e}`)
    ctx.throw(500, 'Internal error')
  }
  if (product === undefined || !product) {
    logger.error(`deleteProduct: Product not found`)
    ctx.throw(404, 'Product not found')
  }
  logger.info(`deleteProduct: result ${JSON.stringify(product)}`)
  ctx.body = product
}

exports.createProduct = async ctx => {
  const values = ctx.request.body
  logger.info(`createProduct: Request body ${JSON.stringify(values)}`)
  const newProduct = await services.createProduct(values)

  if (!newProduct || !newProduct._id) {
    logger.error(`createProduct: Error creating product`)
    ctx.throw(500, 'Error creating product')
  }
  ctx.body = newProduct
}
