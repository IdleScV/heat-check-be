const {Router} = require('express');
const bcrypt = require('bcrypt');

const User = require('../persistence/users');
const Session = require('../persistence/sessions');

const sessionMiddleware = require('../middleware/session-middleware');

const router = new Router();

router.post('/', async (request, response) => {
  console.log('request.body', request.body);
  try {
    const {email, password} = request.body;
    // eslint-disable-next-line unicorn/no-fn-reference-in-iterator
    const user = await User.find(email);
    console.log('We found a user', user);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return response.status(403).json({});
    }

    const sessionId = await Session.create(user.id);
    request.session.id = sessionId;
    console.log('We Created a session', sessionId);
    response.status(201).json({
      sessionId
    });
  } catch (error) {
    console.error(
      `POST session ({ email: ${request.body.email} }) >> ${error.stack})`
    );
    response.status(500).json();
  }
});

router.get('/', sessionMiddleware, (request, response) => {
  response.json({id: request.userId});
});

router.delete('/', async (request, response) => {
  try {
    if (request.session.id) {
      await Session.delete(request.session.id);
    }

    request.session.id = null;
    response.status(200).json();
  } catch (error) {
    console.error(`DELETE session >> ${error.stack}`);
    response.status(500).json();
  }
});

module.exports = router;
