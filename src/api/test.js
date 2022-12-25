const {Router} = require('express');

const router = new Router();

router.get('/', async (request, response) => {
  return response.status(400).json({
    message: 'This is a test route. It is not meant to be used in production.'
  });
});

module.exports = router;
