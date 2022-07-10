const { Router } = require('express');
const { check } = require('express-validator');

const { addUser, loginUser } = require('../controllers/users');
const { validateFields } = require('../middlewares/validateFields');

const router = Router();

router.post('/', [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    validateFields
],addUser);

router.post('/login', loginUser);

module.exports = router;