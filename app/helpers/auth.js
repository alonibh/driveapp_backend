const jwt = require('jsonwebtoken');
const { APIError, APIErrorTypes } = require('./errors')

const tokenOptions = {
        expiresIn: '2d',
        issuer: 'driverapp.meow' // TODO Change
}

const createAuthToken = (username) => {
    // TODO Check exceptions
    const payload = { username: username }
    const secret = process.env.JWT_SECRET
    return jwt.sign(payload, secret, tokenOptions)
}

const getAuthTokenPayload = (token) => {
    // TODO Check exceptions
    const secret = process.env.JWT_SECRET
    return jwt.verify(token, secret, tokenOptions)
}

module.exports = {
    createAuthToken,
    getAuthTokenPayload
}