"use strict";
const koaBody = require('koa-body');
const Router = require('koa-better-router');

const controller = require('../controllers');

module.exports = () => {
  let router = Router().loadMethods();
  router.get('/', controller.getViews);
  router.get('/:id', controller.getView);
  router.patch('/:id', koaBody(), controller.updateView);
  router.delete('/:id', controller.deleteView);
  router.post('/', koaBody(), controller.createView);
  return router.middleware();
};