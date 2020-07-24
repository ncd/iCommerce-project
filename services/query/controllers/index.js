"use strict";
const services = require('../services')

exports.getQueries = async ctx => {
  try {
    ctx.body = await services.getQueries(ctx.request.query)
  }
  catch(e) {
    ctx.throw(500, "Internal error");
  }
}

exports.getQuery = async ctx => {
  const id = ctx.params.id;
  let query;
  try {
    query = await services.getQuery(id);
  }
  catch(e) {
    ctx.throw(500, "Internal error");
  }
  if(!query) {
    ctx.throw(404, "Query not found");
  }
  ctx.body = query;
}


exports.updateQuery = async ctx => {
  let values = ctx.request.body;
  let id = ctx.params.id;
  let query;
  try {
    query = await services.updateQuery(id, values);
  }
  catch(e) {
    ctx.throw(500, "Internal Error");
  }
  if (!query) {
    ctx.throw(404, "Query not found");
  }
  ctx.body = query;
}

exports.deleteQuery = async ctx => {
  let id = ctx.params.id;
  let query;
  try {
    query = await services.deleteQuery(id);
  }
  catch(e) {
    ctx.throw(500, "Error deleting query");
  }
  if (!query) {
    ctx.throw(404, "Query not found");
  }
  ctx.body = query;
}

exports.createQuery = async ctx => {
  let values = ctx.request.body;
  let newQuery = await services.createQuery(values)

  if (!newQuery || !newQuery._id) {
    ctx.throw(500, 'Internal error');
  }
  ctx.body = newQuery;
}
