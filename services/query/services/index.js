const Queries = require('../models/queries')

exports.getQueries = async () => {
  return Queries.find({});
}

exports.getQuery = async id => {
  return Queries.findById(id);
}

exports.createQuery = async values => {
  console.log(values)
  return Queries.create(values);
}

