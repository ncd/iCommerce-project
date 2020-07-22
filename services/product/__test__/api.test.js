'use strict';
require('mockingoose').default;
const axios = require('axios');
const request = require('supertest');
const server = require('../server.js');
jest.mock('axios');

axios.get.mockImplementation( input => {
  return;
});

beforeAll(async () => {
  console.log('Jest starting!');
});
beforeEach(async () => {
});
afterAll(() => {
  server.close();
  console.log('server closed!');
});

describe('API test', () => {
  test('GET /ping test', async () => {
    const response = await request(server).get('/ping');
    expect(response.status).toEqual(200);
    expect(response.text).toMatchSnapshot();
  });
  test('GET / default test', async () => {
    const response = await request(server).get('/');
    expect(response.status).toEqual(200);
    expect(response.text).toMatchSnapshot();
  });
  test('GET / with full text seach test', async () => {
    const response = await request(server).get('/?query=cannon');
    expect(response.status).toEqual(200);
    expect(response.text).toMatchSnapshot();
  });
  test('GET /find/:id test', async () => {
    const response = await request(server).get('/find/1');
    expect(response.status).toEqual(404);
    expect(response.text).toMatchSnapshot();
  });
});