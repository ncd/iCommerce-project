const mockingoose = require('mockingoose').default;
const request = require('supertest');
const server = require('../server.js');

beforeAll(async () => {
  console.log('Jest starting!');
});
beforeEach(async () => {
  // mockingoose.resetAll();
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
    expect(response.status).toEqual(204);
    expect(response.text).toMatchSnapshot();
  });
  test('GET / with full text seach test', async () => {
    const response = await request(server).get('/?query=cannon');
    expect(response.status).toEqual(204);
    expect(response.text).toMatchSnapshot();
  });
  test('GET /find/:id test', async () => {
    const response = await request(server).get('/find/1');
    expect(response.status).toEqual(404);
    expect(response.text).toMatchSnapshot();
  });
});