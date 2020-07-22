const Koa = require('koa');
const routes = require('./routes');
const database = require('./database');

const app = new Koa();

database( {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE
});

const PORT = process.env.PORT || 8080;

// Load the routes
app.use(routes());

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});