const controllers = require('../controllers')
const services = require('../services')
jest.mock('../services')

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
services.getQueries.mockImplementation(async query => {
  if (query.query === 'hp') {
    return []
  }
  if (query.query === 'Cannon') {
    return [_data[3]]
  }
  if (query.brand === 'Cannon') {
    return [_data[2]]
  }
  if (query.category === 'Electronic') {
    return [_data[1]]
  }
  if (query.rating === 4) {
    return [_data[1], _data[2]]
  }
  if (query.minprice === '20000' && query.maxprice === '30000') {
    return [_data[0]]
  }
  if (query.sortby === 'seller' && query.sorttype === 'asc') {
    return []
  }
  return []
})
services.getQuery.mockImplementation(id => {
  return _data[parseInt(id)]
})
services.createQuery.mockImplementation(value => {
  if (value.simulate === 'ok') {
    value.id = '1'
    delete value.simulate
  }
  if (value.simulate === 'failed') {
    value = null
  }
  return value
})
describe('Controllers test', () => {
  test('getQueries test', async () => {
    const ctx = {
      request: {},
      params: {},
      body: '',
      throw: jest.fn(() => {})
    }
    const generateRequest = content => {
      ctx.request.query = content
      return ctx
    }
    await controllers.getQueries(generateRequest({ query: 'hp' }))
    expect(ctx.body).toMatchSnapshot()
    await controllers.getQueries(generateRequest({ brand: 'Cannon' }))
    expect(ctx.body).toMatchSnapshot()
    await controllers.getQueries(generateRequest({ category: 'Electronic' }))
    expect(ctx.body).toMatchSnapshot()
    await controllers.getQueries(generateRequest({ rating: 4 }))
    expect(ctx.body).toMatchSnapshot()
    await controllers.getQueries(generateRequest({ minprice: '20000', maxprice: '30000' }))
    expect(ctx.body).toMatchSnapshot()
    await controllers.getQueries(generateRequest({ sortby: 'seller', sorttype: 'asc' }))
    expect(ctx.body).toMatchSnapshot()
  })
  test('getQueries test', async () => {
    const ctx = {
      params: {},
      request: {},
      body: '',
      throw: jest.fn(() => {})
    }
    const addParams = id => {
      ctx.params.id = id
      return ctx
    }
    await controllers.getQuery(addParams(1))
    expect(ctx.body).toMatchSnapshot()
    await controllers.getQuery(addParams(5))
    expect(ctx.throw).toHaveBeenCalledTimes(1)
  })
  test('createQuery test', async () => {
    const ctx = {
      params: {},
      request: {},
      body: '',
      throw: jest.fn(() => {})
    }
    const data = {
      querystring: 'camera',
      rating: 4,
      minprice: 22000,
      maxprice: 50000
    }
    const addBody = (body, simulate) => {
      ctx.request.body = body
      ctx.request.body.simulate = simulate
      return ctx
    }
    await controllers.createQuery(addBody(data, 'ok'))
    expect(ctx.body).toMatchSnapshot()
    await controllers.createQuery(addBody(data, 'failed'))
    expect(ctx.throw).toHaveBeenCalled()
    await controllers.createQuery(addBody(data, 'xxxx'))
    expect(ctx.throw).toHaveBeenCalled()
  })
})
