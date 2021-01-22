const { authService } = require('../services')
const { APIError, APIErrorTypes } = require('../helpers/errors')
const { getAuthTokenPayload } = require('../helpers/auth')

const verifyAuth = async(req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token)
            throw new APIError(APIErrorTypes.NoAuthKey, null, true)
            
        // TODO what happens on exception?
        req.auth = getAuthTokenPayload(token)
        next()
    } catch(e) { next(e) }
}

const login = async(req, res, next) => {
    try {
        const { username, password } = req.body
        if (!username || !password)
            throw new APIError(APIErrorTypes.InvalidCreds, null, true)

        const token = await authService.login(username, password)
        res.status(200).json({
            "success": true,
            "token": token
        })
    } catch(e) { next(e) }
}

const signup = async(req, res, next) => {
    try {
        const personObj = { username, password, email, firstName, lastName, address } = req.body
        if (Object.values(personObj).some(o => o === null))
            throw new APIError(APIErrorTypes.NullParameters, null, true)
        const result = await authService.signup(personObj)
        res.status(200).json({ "success": true })
    } catch(e) { next(e) }
}

module.exports = {
    login,
    signup,
    verifyAuth
}