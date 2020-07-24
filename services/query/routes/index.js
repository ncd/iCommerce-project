"use strict";
const koaBody = require('koa-body');
const Router = require('koa-better-router');

const controller = require('../controllers');

module.exports = () => {
  let router = Router().loadMethods();
  router.get('/', controller.getQueries);
  router.get('/:id', controller.getQuery);
  router.patch('/:id', koaBody(), controller.updateQuery);
  router.delete('/:id', controller.deleteQuery);
  router.post('/', koaBody(), controller.createQuery);
  return router.middleware();
};