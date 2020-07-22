"use strict";
const services = require('../services');
const axios = require('axios');
const sinon = require('sinon');
const products = require('../models/products');
const { models } = require('mongoose');
require('../models/products');
require('sinon-mongoose');

jest.mock('axios');
const _data = [
  {
    _id: "0",
    name: "Macbook air 2018",
    categories: ["Laptop", "Electronic", "Apple"],
    description: "Macbook new design 2018",
    rating: 5,
    originalprice: 50000,
    currentprice: 30000,
    brand: "Apple",
    seller: "FPT"
  },
  {
    _id: "1",
    name: "HP Notebook 2020",
    categories: ["Laptop", "Electronic", "Device"],
    description: "Brand new device notebook from HP",
    rating: 4.5,
    originalprice: 45000,
    currentprice: 35000,
    brand: "HP",
    seller: "VienThongA"
  },
  {
    _id: "2",
    name: "Cannon D500",
    categories: ["Camera", "Electronic", "Device"],
    description: "New camera 2020",
    rating: 4.5,
    originalprice: 40000,
    currentprice: 38000,
    brand: "Cannon",
    seller: "FPT"
  }
];
axios.post.mockImplementation( input => {
  return true;
});

let modelsMock = sinon.mock(products);
modelsMock.expects('find').withArgs({ $text: { $search: 'hp' }})
  .resolves([_data[0]]);

modelsMock.expects('find').withArgs({ $text: { $search: 'Cannon' }})
  .chain('exec')
  .resolves([_data[2]]);

modelsMock.expects('find').withArgs({ brand: 'Cannon'})
  .resolves([_data[2]]);

modelsMock.expects('find').withArgs({ categories: 'Electronic'})
  .resolves([_data[1], _data[2]]);

modelsMock.expects('find').withArgs({ rating: { $gte: 4 } })
  .resolves([_data[1], _data[2]]);

modelsMock.expects('find').withArgs({ currentprice: { $gt: 20000, $lt: 30000 } })
  .resolves([_data[0]]);

modelsMock.expects('find').withArgs({})
  .chain('sort', 'brand')
  .resolves([_data[0], _data[2], _data[1]]);

modelsMock.expects('find').withArgs({})
  .chain('sort', '-currentprice')
  .resolves([_data[0], _data[1], _data[2]]);

modelsMock.expects('findById').withArgs(1)
  .resolves(_data[parseInt(1)]);

modelsMock.expects('findById').withArgs(100)
  .resolves(null);

modelsMock.expects('create').withArgs({
    querystring: "camera",
    rating: 4,
    minprice: 22000,
    maxprice: 50000,
    simulate: 'ok'
  })
  .resolves({
    id: "5",
    querystring: "camera",
    rating: 4,
    minprice: 22000,
    maxprice: 50000
  });

modelsMock.expects('create').withArgs({
    querystring: "camera",
    rating: 4,
    minprice: 22000,
    maxprice: 50000,
    simulate: 'failed'
  })
  .resolves(null);

describe('Service test', () => {
  test('getProducts test', async () => {
    let result = await services.getProducts({ query: "hp" });
    expect(result).toMatchSnapshot();
    result = await services.getProducts({ brand: "Cannon"});
    expect(result).toMatchSnapshot();
    result = await services.getProducts({ category: "Electronic" });
    expect(result).toMatchSnapshot();
    result = await services.getProducts({ rating: 4 });
    expect(result).toMatchSnapshot();
    result = await services.getProducts({ price: "20000:30000" });
    expect(result).toMatchSnapshot();
    result = await services.getProducts({ sort: 'brand:asc' });
    expect(result).toMatchSnapshot();
    result = await services.getProducts({ sort: 'price:desc' });
    expect(result).toMatchSnapshot();
  }); 
  test('getProduct test', async () => {
    let result = await services.getProduct(1);
    expect(result).toMatchSnapshot();
    result = await services.getProduct(100);
    expect(result).toMatchSnapshot();
  });
  test('createProduct test', async () => {
    let data = {
      querystring: "camera",
      rating: 4,
      minprice: 22000,
      maxprice: 50000
    };
    data.simulate = "ok";
    let result = await services.createProduct(data);
    expect(result).toMatchSnapshot();
    data.simulate = "failed";
    result = await services.createProduct(data);
    expect(result).toMatchSnapshot();
  });
  test('logQuery test', async () => {
    let data = {
      querystring: 'cannon',
      rating: 4,
      brand: 'Cannon',
      category: 'camera',
      seller: 'fpt',
      price: '20000:30000',
      sort: 'brand:asc'
    };
    await services.logQuery(data);
    expect(axios.post).toHaveBeenCalledTimes(1);
  });
});