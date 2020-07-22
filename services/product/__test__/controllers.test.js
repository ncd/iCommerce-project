'use strict';
const controllers = require('../controllers');
const services = require('../services');
jest.mock('../services');

const _data = [
  {
    _id: '0',
    name: 'Macbook air 2018',
    categories: ['Laptop', 'Electronic', 'Apple'],
    description: 'Macbook new design 2018',
    rating: 5,
    originalprice: 50000,
    currentprice: 30000,
    brand: 'Apple',
    seller: 'FPT'
  },
  {
    _id: '1',
    name: 'HP Notebook 2020',
    categories: ['Laptop', 'Electronic', 'Device'],
    description: 'Brand new device notebook from HP',
    rating: 4.5,
    originalprice: 45000,
    currentprice: 35000,
    brand: 'HP',
    seller: 'VienThongA'
  },
  {
    _id: '2',
    name: 'Cannon D500',
    categories: ['Camera', 'Electronic', 'Device'],
    description: 'New camera 2020',
    rating: 4.5,
    originalprice: 40000,
    currentprice: 38000,
    brand: 'Cannon',
    seller: 'FPT'
  }
];
services.getProducts.mockImplementation(async query => {
  console.log(query);
  if ( query.query === 'hp') {
    return [_data[1]];
  }
  if ( query.query === 'Cannon' ) {
    return [_data[2]];
  }
  if (query.brand === 'Cannon' ) {
    return [_data[2]];
  }
  if (query.category === 'Electronic') {
    return [_data[0], _data[1], _data[2]];
  }
  if (query.rating === 4) {
    return [_data[0], _data[1], _data[2]];
  }
  if (query.price === '20000:30000') {
    return [_data[0]];
  }
  if (query.sort === 'seller:asc' ) {
    return [_data[0], _data[2], _data[1]];
  }
  return [];
});
services.getProduct.mockImplementation(id => {
  return _data[parseInt(id)];
})
services.createProduct.mockImplementation(value => {
  if (value.simulate === 'ok') {
    value.id = '1';
    delete value.simulate;
  }
  if (value.simulate === 'failed') {
    value = null;
  }
  return value;
});
describe('Controllers test', () => {
  test('getProducts test', async () => {
    let ctx = {
      request: {},
      params: {},
      body: '',
      throw: jest.fn(() => {})
    };
    let generateRequest = content => {
      ctx.request.query = content;
      return ctx;
    };
    await controllers.getProducts(generateRequest({ query: 'hp' }));
    expect(ctx.body).toMatchSnapshot();
    await controllers.getProducts(generateRequest({ brand: 'Cannon'}));
    expect(ctx.body).toMatchSnapshot();
    await controllers.getProducts(generateRequest({ category: 'Electronic' }));
    expect(ctx.body).toMatchSnapshot();
    await controllers.getProducts(generateRequest({ rating: 4 }));
    expect(ctx.body).toMatchSnapshot();
    await controllers.getProducts(generateRequest({ price: '20000:30000' }));
    expect(ctx.body).toMatchSnapshot();
    await controllers.getProducts(generateRequest({ sort: 'seller:asc'}));
    expect(ctx.body).toMatchSnapshot();
  }); 
  test('getProduct test', async () => {
    let ctx = {
      params: {},
      request: {},
      body: '',
      throw: jest.fn(() => {})
    };
    let addParams = id => {
      ctx.params.id = id;
      return ctx;
    };
    console.log(ctx);
    await controllers.getProduct(addParams(1));
    expect(ctx.body).toMatchSnapshot();
    await controllers.getProduct(addParams(5));
    expect(ctx.throw).toHaveBeenCalledTimes(1);
  });
  test('createProduct test', async () => {
    let ctx = {
      params: {},
      request: {},
      body: '',
      throw: jest.fn(() => {})
    };
    let data = {
      name: 'HP Notebook 2020',
      categories: ['Laptop', 'Electronic', 'Device'],
      description: 'Brand new device notebook from HP',
      rating: 4.5,
      originalprice: 45000
    };
    let addBody = (body, simulate) => {
      ctx.request.body = body;
      ctx.request.body.simulate = simulate;
      return ctx;
    };
    await controllers.createProduct(addBody(data, 'ok'));
    expect(ctx.body).toMatchSnapshot();
    await controllers.createProduct(addBody(data, 'failed'));
    expect(ctx.throw).toHaveBeenCalled();
    await controllers.createProduct(addBody(data, 'xxxx'));
    expect(ctx.throw).toHaveBeenCalled();
  });
});