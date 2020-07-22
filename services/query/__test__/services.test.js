const services = require('../services');
const models = require('../models/queries');
const { model } = require('../models/queries');
jest.mock('../models/queries');

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
models.find.mockImplementation( query => {
  console.log(query);
  var test = { '$text': { '$search': 'hp' }};
  console.log(test);
  if ( JSON.stringify(query) === JSON.stringify({ '$text': { '$search': 'hp' }})) {
    return [];
  }
  if (JSON.stringify(query) === JSON.stringify({ '$text': { "$search": "Cannon" }})) {
    return [_data[3]];
  }
  if (query.brand === "Cannon" ) {
    return [_data[2]];
  }
  if (query.category === "Electronic") {
    return [_data[1]];
  }
  if (query.rating === 4) {
    return [_data[1], _data[2]];
  }
  if (query.minprice === 20000 && query.maxprice === 30000) {
    return [_data[0]];
  }
  if (query.sortby === "seller" && query.sorttype === "asc") {
    return [];
  }
  return [];
});
models.findById.mockImplementation( id => {
  return _data[parseInt(id)];
});
models.create.mockImplementation( query => {
  if (query.simlate === "ok") {
    query._id = "id";
    delete query.simulate;
  }
  else {
    query = null;
  }
  return query;
});
describe('Service test', () => {
  test('getQueries test', async () => {
    let result = await services.getQueries({ query: "hp" });
    expect(result).toMatchSnapshot();
    result = await services.getQueries({ brand: "Cannon"});
    expect(result).toMatchSnapshot();
    result = await services.getQueries({ category: "Electronic" });
    expect(result).toMatchSnapshot();
    result = await services.getQueries({ rating: 4 });
    expect(result).toMatchSnapshot();
    result = await services.getQueries({ minprice: 20000, maxprice: 30000 });
    expect(result).toMatchSnapshot();
    result = await services.getQueries({ sortby: 'seller', sorttype: 'asc'});
    expect(result).toMatchSnapshot();
  }); 
  test('getQuery test', async () => {
    let result = await services.getQuery(1);
    expect(result).toMatchSnapshot();
    result = await services.getQuery(100);
    expect(result).toMatchSnapshot();
  });
  test('createQuery test', async () => {
    let data = {
      querystring: "camera",
      rating: 4,
      minprice: 22000,
      maxprice: 50000
    };
    data.simulate = "ok";
    let result = await services.createQuery(data);
    expect(result).toMatchSnapshot();
    data.simlate = "failed";
    result = await services.createQuery(data);
    expect(result).toMatchSnapshot();
  });
});