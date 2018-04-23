const express = require('express');
const router = express.Router();

router.get('/teste', (request, response) => response.json({flashMesg: 'Users Works'}));

module.exports = router;