const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    // res.send('Test route served');
    res.render('index', { title: 'Divblox API Root' });
});

module.exports = router;
