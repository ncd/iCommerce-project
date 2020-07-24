require('mockingoose').default;
require('sinon-mongoose');
const sinon = require('sinon');
const queries = require('../models/queries');
const request = require('supertest');
const server = require('../server.js');

const _data = [
  {
    _id: "0",
    querystring: "macbook",
    rating: 3.5,
    minprice: 20000,
    maxprice: 30000,
    sortby: "categories",
    sorttype: "asc"
  },
  {
    _id: "1",
    querystring: "laptop",
    category: "Electronic",
    rating: 4,
    minprice: 22000,
    maxprice: 50000,
    brand: "Apple"
  },
  {
    _id: "2",
    querystring: "camera",
    rating: 4,
    minprice: 22000,
    maxprice: 50000,
    brand: "Cannon",
    seller: "VienThongA",
    sortby: "seller",
    sorttype: "desc"
  },
  {
    _id: "3",
    querystring: "Cannon"
  }
];

let modelsMock = sinon.mock(queries);
describe('API test', () => {
  afterAll(() => {
    server.close();
  });
  test('GET / default test', async () => {
    modelsMock.expects('find').resolves([_data[0], _data[1], _data[2], _data[3]]);
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.text).toMatchSnapshot();
  });
  test('GET / with full text seach test', async () => {
    modelsMock.expects('find').resolves([_data[3]]);
    let response = await request(server).get('/?query=cannon');
    expect(response.status).toEqual(200);
    expect(response.text).toMatchSnapshot();

    modelsMock.expects('find').rejects("Error");
    response = await request(server).get('/?query=cannon');
    expect(response.status).toEqual(500);
    expect(response.text).toMatchSnapshot();
  });
  test('GET /find/:id test', async () => {
    let response = await request(server).get('/1');
    expect(response.status).toEqual(404);
    expect(response.text).toMatchSnapshot();

    modelsMock.expects('findById').withArgs('5f1a8e10d2a5c77d8edd8169')
      .resolves([_data[1]]);
    response = await request(server).get('/5f1a8e10d2a5c77d8edd8169');
    expect(response.status).toEqual(200);
    expect(response.text).toMatchSnapshot();

    modelsMock.expects('findById').withArgs('5f1a8e10d2a5c77d8edd8169')
      .rejects("Error");
    response = await request(server).get('/5f1a8e10d2a5c77d8edd8169');
    expect(response.status).toEqual(500);
    expect(response.text).toMatchSnapshot();
  });
  test('POST / test', async () => {
    modelsMock.expects('create').withArgs({ querystring: 'cannon'})
      .resolves({
        _id: '4',
        querystring: 'cannon'
      });
    const response = await request(server).post('/').send({querystring: 'cannon'});
    expect(response.status).toEqual(200);
    expect(response.text).toMatchSnapshot();
  });
  test('PATCH /:id test', async () => {
    modelsMock.expects('findByIdAndUpdate').withArgs('5f1a4bddddf1c37354a38cd8', { querystring: 'cannon'})
      .resolves({querystring: 'cannon', save: jest.fn()});
    let response = await request(server).patch('/5f1a4bddddf1c37354a38cd8').send({ querystring: 'cannon'});
    expect(response.status).toEqual(200);
    expect(response.text).toMatchSnapshot();

    response = await request(server).patch('/1').send({ querystring: 'cannon'});
    expect(response.status).toEqual(404);
    expect(response.text).toMatchSnapshot();

    modelsMock.expects('findByIdAndUpdate').withArgs('5f1a4bddddf1c37354a38cd8', { querystring: 'cannon'})
      .resolves(null);
    response = await request(server).patch('/5f1a4bddddf1c37354a38cd8').send({ querystring: 'cannon'});
    expect(response.status).toEqual(404);
    expect(response.text).toMatchSnapshot();

    modelsMock.expects('findByIdAndUpdate').withArgs('5f1a4bddddf1c37354a38cd8', { querystring: 'cannon'})
      .resolves({querystring: 'cannon', save: async() => { throw "Error"; }});
    response = await request(server).patch('/5f1a4bddddf1c37354a38cd8').send({ querystring: 'cannon'});
    expect(response.status).toEqual(500);
    expect(response.text).toMatchSnapshot();
  });
  test('DELETE /:id test', async () => {
    modelsMock.expects('findByIdAndDelete').withArgs('5f1a4bddddf1c37354a38cd8')
      .resolves({querystring: 'cannon'});
    let response = await request(server).delete('/5f1a4bddddf1c37354a38cd8');
    expect(response.status).toEqual(200);
    expect(response.text).toMatchSnapshot();

    response = await request(server).delete('/1');
    expect(response.status).toEqual(404);
    expect(response.text).toMatchSnapshot();

    modelsMock.expects('findByIdAndDelete').withArgs('5f1a4bddddf1c37354a38cd8')
      .resolves(null);
    response = await request(server).delete('/5f1a4bddddf1c37354a38cd8');
    expect(response.status).toEqual(404);
    expect(response.text).toMatchSnapshot();

    modelsMock.expects('findByIdAndDelete').withArgs('5f1a4bddddf1c37354a38cd8')
      .rejects("Error");
    response = await request(server).delete('/5f1a4bddddf1c37354a38cd8');
    expect(response.status).toEqual(500);
    expect(response.text).toMatchSnapshot();
  });
});