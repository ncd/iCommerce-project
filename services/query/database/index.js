'use strict'
const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const connectToDb = async (uri, options) => {
  try {
    await mongoose.connect(uri, options)
    console.log('Connected to database')
  } catch (err) {
    if (err.message && err.message.match(/failed to connect to server .* on first connect/)) {
      console.log(new Date(), String(err))
      await timeout(10000)
      console.log('Retrying first connect...')
      await connectToDb(uri, options)
    } else {
      console.error('Database connection failed: ', String(err))
    }
  }
}

module.exports = async (dbOptions = {}) => {
  const {
    username = 'icommerce',
    password = 'password',
    host = 'localhost',
    port = '27017',
    database = 'icommerce'
  } = dbOptions

  const options = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  }

  const uri = `mongodb://${username}:${password}@${host}:${port}/${database}`
  return connectToDb(uri, options)
}
