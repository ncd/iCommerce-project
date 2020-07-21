const services = require('../services')

exports.getQueries = async ctx => {
  ctx.body = await services.getQueries()
}

exports.getQuery = async ctx => {
  const id = ctx.params.id;
  const query = await services.getQuery(id)

  if(!query) {
    ctx.throw(404, "Query not found")
  }
  ctx.body = query
}

exports.createQuery = async ctx => {
  let values = ctx.request.body;
  let newQuery = await services.createQuery(values)

  if (!newQuery || !newQuery._id) {
    ctx.throw(500, 'Error creating query');
  }
  ctx.body = newQuery;
}

exports.ping = async ctx => {
  ctx.body = "Ping success"
}

