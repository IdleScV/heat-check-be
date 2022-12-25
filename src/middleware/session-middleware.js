const Session = require('../persistence/sessions');

const sessionMiddleware = async (request, response, next) => {
  console.log('here we are at middleware', request.query);
  if (!request.query.session) {
    return response.sendStatus(401);
  }

  try {
    // eslint-disable-next-line unicorn/no-fn-reference-in-iterator
    const session = await Session.find(request.query.session);

    if (!session) {
      request.query.session = null;
      return response.sendStatus(401);
    }

    request.userId = session.userId;
    next();
  } catch (error) {
    console.error(
      `SessionMiddleware(${request.query.session}) >> Error: ${error.stack}`
    );
    return response.sendStatus(500);
  }
};

module.exports = sessionMiddleware;
