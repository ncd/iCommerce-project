'use strict'
const koaBody = require('koa-body')
const Router = require('koa-better-router')

const controller = require('../controllers')

module.exports = () => {
  const router = Router().loadMethods()
  router.get('/', controller.getProducts)
  router.get('/:id', controller.getProduct)
  router.patch('/:id', koaBody(), controller.updateProduct)
  router.delete('/:id', controller.deleteProduct)
  router.post('/', koaBody(), controller.createProduct)

  return router.middleware()
}
