'use strict'
require('mockingoose')
require('sinon-mongoose')
const sinon = require('sinon')
const views = require('../models/views')
const request = require('supertest')
const server = require('../server.js')

const _data = [
  {
    _id: '0',
    productid: '1234567'
  },
  {
    _id: '1',
    productid: '234924124'
  },
  {
    _id: '2',
    productid: '123jk3234'
  }
]

const modelsMock = sinon.mock(views)

describe('API test', () => {
  afterAll(() => {
    server.close()
  })

  test('GET / default test', async () => {
    modelsMock.expects('find').resolves([_data[0], _data[1], _data[2]])
    const response = await request(server).get('/')
    expect(response.status).toEqual(200)
    expect(response.text).toMatchSnapshot()
  })

  test('GET / with productid', async () => {
    modelsMock.expects('find').withArgs({ productid: '1234567' })
      .resolves([_data[0]])
    const response = await request(server).get('/?productid=1234567')
    expect(response.status).toEqual(200)
    expect(response.text).toMatchSnapshot()
  })

  test('GET / internal error', async () => {
    modelsMock.expects('find')
      .rejects('Error')
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
    modelsMock.expects('create').withArgs({ productid: '5f1a4bddddf1c37354a38cd8' })
      .resolves({
        _id: '4',
        query: '12345'
      })
    const response = await request(server).post('/').send({ productid: '5f1a4bddddf1c37354a38cd8' })
    expect(response.status).toEqual(200)
    expect(response.text).toMatchSnapshot()
  })

  test('PATCH /:id test', async () => {
    modelsMock.expects('findByIdAndUpdate').withArgs('5f1a4bddddf1c37354a38cd8', { productid: '123456' })
      .resolves({ productid: '123456', save: jest.fn() })
    let response = await request(server).patch('/5f1a4bddddf1c37354a38cd8').send({ productid: '123456' })
    expect(response.status).toEqual(200)
    expect(response.text).toMatchSnapshot()

    response = await request(server).patch('/1').send({ productid: 'cannon' })
    expect(response.status).toEqual(404)
    expect(response.text).toMatchSnapshot()

    modelsMock.expects('findByIdAndUpdate').withArgs('5f1a4bddddf1c37354a38cd8', { productid: 'cannon' })
      .resolves(null)
    response = await request(server).patch('/5f1a4bddddf1c37354a38cd8').send({ productid: 'cannon' })
    expect(response.status).toEqual(404)
    expect(response.text).toMatchSnapshot()

    modelsMock.expects('findByIdAndUpdate').withArgs('5f1a4bddddf1c37354a38cd8', { productid: 'cannon' })
      .resolves({ productid: 'cannon', save: async () => { throw new Error('Error') } })
    response = await request(server).patch('/5f1a4bddddf1c37354a38cd8').send({ productid: 'cannon' })
    expect(response.status).toEqual(500)
    expect(response.text).toMatchSnapshot()
  })

  test('DELETE /:id test', async () => {
    modelsMock.expects('findByIdAndDelete').withArgs('5f1a4bddddf1c37354a38cd8')
      .resolves({ productid: '123456' })
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
