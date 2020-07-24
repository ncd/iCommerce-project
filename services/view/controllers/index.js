"use strict";
const services = require('../services')

exports.getViews = async ctx => {
  ctx.body = await services.getViews(ctx.request.query)
}

exports.getView = async ctx => {
  const id = ctx.params.id;
  let view;
  try {
    view = await services.getView(id);
  }
  catch(e) {
    ctx.throw(500, "Internal error");
  }
  if(!view) {
    ctx.throw(404, "Query not found");
  }
  ctx.body = view;
}

exports.updateView = async ctx => {
  let values = ctx.request.body;
  let id = ctx.params.id;
  let view;
  try {
    view = await services.updateView(id, values);
  }
  catch(e) {
    ctx.throw(500, "Internal Error");
  }
  if (!view) {
    ctx.throw(404, "View not found");
  }
  ctx.body = view;
}

exports.deleteView = async ctx => {
  let id = ctx.params.id;
  let view;
  try {
    view = await services.deleteView(id);
  }
  catch(e) {
    ctx.throw(500, "Error deleting view");
  }
  if (!view) {
    ctx.throw(404, "Query not found");
  }
  ctx.body = view;
}

exports.createView = async ctx => {
  let values = ctx.request.body;
  let newView = await services.createView(values)

  if (!newView || !newView._id) {
    ctx.throw(500, 'Internal error');
  }
  ctx.body = newView;
}
