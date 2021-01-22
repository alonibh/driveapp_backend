const { Person } = require('../models/person')
const { APIError, APIErrorTypes } = require('../helpers/errors')
const bcrypt = require('bcrypt')
const { createAuthToken } = require('../helpers/auth')

const signup = async(personObj) => {
    // Race?
    const p = await Person.findOne({ username: personObj.username }, 'username')
    if (p)
        throw new APIError(APIErrorTypes.UsernameExists, personObj.username, true)
    
    // Hash password
    const salt = await bcrypt.genSalt(10)
    personObj.password = await bcrypt.hash(personObj.password, salt)

    try { return await new Person(personObj).save(); }
    catch (e) {
        throw e instanceof ValidationError ? APIError(APIErrorTypes.BadParameters, null, true) : e
    }
}

const login = async(username, password) => {
    const p = await Person.findOne({ username: username }).select('username password')
    if (!p)
        throw new APIError(APIErrorTypes.InvalidCreds, null, true)
    
    const isPasswordValid = await bcrypt.compare(password, p.password)
    if (!isPasswordValid)
        throw new APIError(APIErrorTypes.InvalidCreds, null, true)

    return createAuthToken(username)
}

module.exports = {
    login,
    signup
}