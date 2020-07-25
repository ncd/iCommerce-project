'use strict'
const services = require('../services')
const models = require('../models/queries')
const sinon = require('sinon')
require('sinon-mongoose')

const _data = [
  {
    _id: '0',
    querystring: 'macbook',
    rating: 3.5,
    minprice: 20000,
    maxprice: 30000,
    sortby: 'categories',
    sorttype: 'asc'
  },
  {
    _id: '1',
    querystring: 'laptop',
    category: 'Electronic',
    rating: 4,
    minprice: 22000,
    maxprice: 50000,
    brand: 'Apple'
  },
  {
    _id: '2',
    querystring: 'camera',
    rating: 4,
    minprice: 22000,
    maxprice: 50000,
    brand: 'Cannon',
    seller: 'VienThongA',
    sortby: 'seller',
    sorttype: 'desc'
  },
  {
    _id: '3',
    querystring: 'Cannon'
  }
]
const modelsMock = sinon.mock(models)

describe('Service test', () => {
  test('getQueries test', async () => {
    modelsMock.expects('find').withArgs({ $text: { $search: 'hp' } })
      .resolves([])
    modelsMock.expects('find').withArgs({ $text: { $search: 'Cannon' } })
      .resolves([_data[3]])
    modelsMock.expects('find').withArgs({ brand: 'Cannon'})
      .resolves([_data[2]])
    modelsMock.expects('find').withArgs({ category: 'Electronic'})
      .resolves([_data[1]])
    modelsMock.expects('find').withArgs({ rating: 4})
      .resolves([_data[1], _data[2]])
    modelsMock.expects('find').withArgs({ minprice: 20000, maxprice: 30000})
      .resolves([_data[0]])
    modelsMock.expects('find').withArgs({ sortby: 'seller', sorttype: 'asc'})
      .resolves([])
    let result = await services.getQueries({ query: 'hp' })
    expect(result).toMatchSnapshot()
    result = await services.getQueries({ brand: 'Cannon' })
    expect(result).toMatchSnapshot()
    result = await services.getQueries({ category: 'Electronic' })
    expect(result).toMatchSnapshot()
    result = await services.getQueries({ rating: 4 })
    expect(result).toMatchSnapshot()
    result = await services.getQueries({ minprice: 20000, maxprice: 30000 })
    expect(result).toMatchSnapshot()
    result = await services.getQueries({ sortby: 'seller', sorttype: 'asc' })
    expect(result).toMatchSnapshot()
  })

  test('getQuery test', async () => {
    modelsMock.expects('findById').withArgs('1')
      .resolves(_data[1])
    modelsMock.expects('findById').withArgs('100')
      .resolves(null)
    let result = await services.getQuery('1')
    expect(result).toMatchSnapshot()
    result = await services.getQuery('100')
    expect(result).toMatchSnapshot()
  })

  test('createQuery test', async () => {
    const data = {
      querystring: 'camera',
      rating: 4,
      minprice: 22000,
      maxprice: 50000
    }
    modelsMock.expects('create').withArgs({ maxprice: 50000, minprice: 22000, querystring: "camera", rating: 4, simulate: "ok" })
      .resolves({...data, _id: 'id'})
    modelsMock.expects('create').withArgs({ maxprice: 50000, minprice: 22000, querystring: "camera", rating: 4, simulate: "failed" })
      .resolves(null)
    data.simulate = 'ok'
    let result = await services.createQuery(data)
    expect(result).toMatchSnapshot()
    data.simulate = 'failed'
    result = await services.createQuery(data)
    expect(result).toMatchSnapshot()
  })
})
