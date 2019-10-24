const app = require('express')();
const bodyParser = require('body-parser');

const routes = require('../routes');

app.use(bodyParser.json());
app.set('port', process.env.PORT || 3000);

Object.keys(routes).forEach(key => app.use(`/${key}`, routes[key]));

module.exports = app;
