"use strict";

const services = require('../services');


exports.getProducts = async ctx => {
  const query = ctx.request.query;
  let response = {}
  response.products = await services.getProducts(ctx.request.query);
  try {
    response.brands = await services.getFieldCounts(query.query, "brand");
    response.ratings = await services.getFieldCounts(query.query, "rating");
    response.categories = await services.getFieldCounts(query.query, "categories");
    response.sellers = await services.getFieldCounts(query.query, "seller");
  }
  catch(e) {
    ctx.throw(500, "Internal Error")
  }
  try {
    await services.logQuery(query);
  }
  catch(e) {
    ctx.throw(500, "Internal Error");
  }
  ctx.body = response;
}

exports.getProduct = async ctx => {
  const id = ctx.params.id;
  const product = await services.getProduct(id);

  if(!product) {
    ctx.throw(404, "Product not found")
  }
  ctx.body = product
}

exports.createProduct = async ctx => {
  let values = ctx.request.body;
  console.log(services.createProduct(values) instanceof Promise);
  let newProduct = await services.createProduct(values);

  if (!newProduct || !newProduct._id) {
    ctx.throw(500, 'Error creating product');
  }
  ctx.body = newProduct;
}

exports.ping = async ctx => {
  ctx.body = "Ping success"
}

