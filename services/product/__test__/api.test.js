'use strict'
require('mockingoose')
require('sinon-mongoose')
const sinon = require('sinon')
const products = require('../models/products')
const axios = require('axios')
const request = require('supertest')
const server = require('../server.js')

jest.mock('axios')

axios.get.mockImplementation(input => {
  return;
})

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
]

const modelsMock = sinon.mock(products)

describe('API test', () => {
  afterAll(() => {
    server.close()
  })

  test('GET / default test', async () => {
    modelsMock.expects('find').withArgs({})
      .resolves([_data[0], _data[1], _data[2]])
    modelsMock.expects('aggregate').exactly(4).resolves([])
    const response = await request(server).get('/')
    expect(response.status).toEqual(200)
    expect(response.text).toMatchSnapshot()
  })

  test('GET / with full text seach test', async () => {
    modelsMock.expects('find').withArgs({ $text: { $search: 'cannon' } })
      .resolves([_data[2]])
    modelsMock.expects('aggregate').exactly(4).resolves([])
    const response = await request(server).get('/?query=cannon')
    expect(response.status).toEqual(200)
    expect(response.text).toMatchSnapshot()
  })

  test('GET / internal error', async () => {
    modelsMock.expects('find').withArgs({ $text: { $search: 'cannon' } })
      .resolves([_data[2]])
    const response = await request(server).get('/?query=cannon')
    expect(response.status).toEqual(500)
    expect(response.text).toMatchSnapshot()
  })

  test('GET /:id test valid id', async () => {
    modelsMock.expects('findById').withArgs('5f1a4bddddf1c37354a38cd8')
      .resolves(_data[1])
    const response = await request(server).get('/5f1a4bddddf1c37354a38cd8')
    expect(response.status).toEqual(200)
    expect(response.text).toMatchSnapshot()
  })

  test('GET /:id invalid id', async () => {
    let response = await request(server).get('/1')
    expect(response.status).toEqual(404)
    expect(response.text).toMatchSnapshot()
    modelsMock.expects('findById').withArgs('5f1a4bddddf1c37354a38cd8')
      .rejects('Error')
    response = await request(server).get('/5f1a4bddddf1c37354a38cd8')
    expect(response.status).toEqual(500)
    expect(response.text).toMatchSnapshot()
  })

  test('POST / test', async () => {
    modelsMock.expects('create').withArgs({ query: 'cannon' })
      .resolves({
        _id: '4',
        query: 'cannon'
      })
    const response = await request(server).post('/').send({ query: 'cannon' })
    expect(response.status).toEqual(200)
    expect(response.text).toMatchSnapshot()
  })

  test('PATCH /:id test', async () => {
    modelsMock.expects('findByIdAndUpdate').withArgs('5f1a4bddddf1c37354a38cd8', { name: 'cannon' })
      .resolves({ name: 'cannon', save: jest.fn() })
    let response = await request(server).patch('/5f1a4bddddf1c37354a38cd8').send({ name: 'cannon' })
    expect(response.status).toEqual(200)
    expect(response.text).toMatchSnapshot()

    response = await request(server).patch('/1').send({ name: 'cannon' })
    expect(response.status).toEqual(404)
    expect(response.text).toMatchSnapshot()

    modelsMock.expects('findByIdAndUpdate').withArgs('5f1a4bddddf1c37354a38cd8', { name: 'cannon' })
      .resolves(null)
    response = await request(server).patch('/5f1a4bddddf1c37354a38cd8').send({ name: 'cannon' })
    expect(response.status).toEqual(404)
    expect(response.text).toMatchSnapshot()

    modelsMock.expects('findByIdAndUpdate').withArgs('5f1a4bddddf1c37354a38cd8', { name: 'cannon' })
      .resolves({ name: 'cannon', save: async () => { throw new Error('Error') } })
    response = await request(server).patch('/5f1a4bddddf1c37354a38cd8').send({ name: 'cannon' })
    expect(response.status).toEqual(500)
    expect(response.text).toMatchSnapshot()
  })

  test('DELETE /:id test', async () => {
    modelsMock.expects('findByIdAndDelete').withArgs('5f1a4bddddf1c37354a38cd8')
      .resolves({ name: 'cannon' })
    let response = await request(server).delete('/5f1a4bddddf1c37354a38cd8')
    expect(response.status).toEqual(200)
    expect(response.text).toMatchSnapshot()

    response = await request(server).delete('/1')
    expect(response.status).toEqual(404)
    expect(response.text).toMatchSnapshot()

    modelsMock.expects('findByIdAndDelete').withArgs('5f1a4bddddf1c37354a38cd8')
      .resolves(null)
    response = await request(server).delete('/5f1a4bddddf1c37354a38cd8')
    expect(response.status).toEqual(404)
    expect(response.text).toMatchSnapshot()

    modelsMock.expects('findByIdAndDelete').withArgs('5f1a4bddddf1c37354a38cd8')
      .rejects('Error')
    response = await request(server).delete('/5f1a4bddddf1c37354a38cd8')
    expect(response.status).toEqual(500)
    expect(response.text).toMatchSnapshot()
  })
})
