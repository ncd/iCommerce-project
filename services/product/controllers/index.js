"use strict";

const services = require('../services');

exports.getProducts = async ctx => {
  const query = ctx.request.query;
  let response = {};
  try {
    [response.products, response.brands, response.ratings, response.categories, response.sellers] = await Promise.all([
      services.getProducts(ctx.request.query),
      services.getFieldCounts(query.query, "brand"),
      services.getFieldCounts(query.query, "rating"),
      services.getFieldCounts(query.query, "categories"),
      services.getFieldCounts(query.query, "seller")
    ]);
  }
  catch(e) {
    ctx.throw(500, "Internal Error");
  }
  try {
    await services.logQuery(query);
  }
  catch(e) {
    console.log("Error saving query log");
  }
  ctx.body = response;
}

exports.getProduct = async ctx => {
  const id = ctx.params.id;
  let product;
  try {
    product = await services.getProduct(id);
  }
  catch(e) {
    ctx.throw(500, "Internal error");
  }
  if(product === undefined || !product) {
    ctx.throw(404, "Product not found")
  }
  ctx.body = product;
}

exports.updateProduct = async ctx => {
  let values = ctx.request.body;
  let id = ctx.params.id;
  let product;
  try {
    product = await services.updateProduct(id, values);
  }
  catch(e) {
    ctx.throw(500, "Internal error");
  }
  if(product === undefined || !product) {
    ctx.throw(404, "Product not found");
  }
  ctx.body = product;
}

exports.deleteProduct = async ctx => {
  let id = ctx.params.id;
  let product;
  try {
    product = await services.deleteProduct(id);
  }
  catch(e) {
    ctx.throw(500, "Internal error");
  }
  if (product === undefined || !product) {
    ctx.throw(404, "Product not found");
  }
  ctx.body = product;
}

exports.createProduct = async ctx => {
  let values = ctx.request.body;
  let newProduct = await services.createProduct(values);

  if (!newProduct || !newProduct._id) {
    ctx.throw(500, 'Error creating product');
  }
  ctx.body = newProduct;
}

