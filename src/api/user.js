const {Router} = require('express');
const User = require('../persistence/users');
const sessionMiddleware = require('../middleware/session-middleware');

const router = new Router();

router.post('/', async (request, response) => {
  try {
    const {email, password} = request.body;
    if (!email || !password) {
      return response
        .status(400)
        .json({message: 'email and password must be provided'});
    }

    const user = await User.create(email, password);
    if (!user) {
      return response.status(400).json({message: 'User already exists'});
    }

    return response.status(200).json(user);
  } catch (error) {
    console.error(
      `createUser({ email: ${request.body.email} }) >> Error: ${error.stack}`
    );
    response.status(500).json();
  }
});

router.get('/', 
sessionMiddleware, 
async (request, response) => {
  
  try {

    const {id} = request.query;
    console.log("WE GOT HERE!!",  request.query)
    const user = await User.findById(id);
   
    if (!user ) {
      return response.status(403).json({});
    }

    response.status(201).json({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    console.error(
      `GET user ({ email: ${request.body} }) >> ${error.stack})`
    );
    response.status(500).json();
  }
});

module.exports = router;
