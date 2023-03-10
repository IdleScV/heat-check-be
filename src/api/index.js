const express = require('express');

const {Router} = express;

const user = require('./user');
const session = require('./session');

const test = require('./test');

const router = new Router();
router.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  response.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

router.use('/api/users', user);
router.use('/api/sessions', session);
router.use('/api/test', test);

module.exports = router;
