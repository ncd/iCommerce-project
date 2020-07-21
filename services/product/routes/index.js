const koaBody = require('koa-body');
const Router = require('koa-better-router');

const controller = require('../controllers');

module.exports = () => {
  let router = Router().loadMethods();
  router.get('/', controller.getProducts);
  router.get('/find/:id', controller.getProduct);
  router.post('/', koaBody(), controller.createProduct);
  router.get('/ping', controller.ping);
  return router.middleware();
};