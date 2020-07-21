const koaBody = require('koa-body');
const Router = require('koa-better-router');

const controller = require('../controllers');

module.exports = () => {
  let router = Router().loadMethods();
  router.get('/', controller.getQueries);
  router.get('/find/:id', controller.getQuery);
  router.post('/', koaBody(), controller.createQuery);
  router.get('/ping', controller.ping);
  return router.middleware();
};