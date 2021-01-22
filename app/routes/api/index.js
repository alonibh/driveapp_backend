const router = require('express').Router();

router.use('/person', require('./person'));
router.use('/drive', require('./drive'));
router.use('/auth', require('./auth'));

module.exports = router;