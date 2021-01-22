const router = require('express').Router();
const { auth } = require('../../controllers');

/**
 * @api {post} /auth/login Login
 * @apiVersion 0.1.0
 * @apiName Login
 * @apiGroup Auth
 * 
 * @apiDescription Login. currently simple login, 
 * using username and password.
 * 
 * @apiParam {String} username username
 * @apiParam {String} password password
 *
 * @apiSuccess {Boolean} success success boolean
 * @apiSuccess {String} token authorization token (send as Authorization header)
 * 
 * @apiError InvalidCreds Invalid username or password
 */
router.post('/login', auth.login)

/**
 * @api {post} /auth/signup Signup
 * @apiGroup Auth
 * 
 * @apiDescription Sign up a user.
 * 
 * @apiParam {String} username username
 * @apiParam {String} password password
 * @apiParam {String} firstName First name
 * @apiParam {String} lastName Last name
 * @apiParam {String} address address
 * @apiParam {String} email
 * 
 * @apiSuccess {Boolean} success success boolean
 * 
 * @apiError UsernameExists Username already exists
 * @apiError BadParameters Bad Parameteremail (if same user)s
 */
router.post('/signup', auth.signup)

module.exports = router;