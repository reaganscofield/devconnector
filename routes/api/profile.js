const express = require('express');
const router = express.Router();

router.get('/teste', (request, response) => response.json({flashMesg: 'Profile Works'}));

module.exports = router;