const {Router} = require('express');

const router = new Router();

router.get('/', async (request, response) => {
    console.log("LOGGIN: hello here")
    return response
        .status(400)
        .json({
            message: 'This is a test route. It is not meant to be used in production.'
        });
});

module.exports = router;
