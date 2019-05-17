const app = require('express')();
const routes = require('../routes');

app.set('port', process.env.PORT || 3000);

Object.keys(routes).forEach(key => app.use(`/${key}`, routes[key]));

module.exports = app;
