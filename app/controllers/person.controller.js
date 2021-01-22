const { personService } = require('../services')
const { pick, pickArray } = require('../helpers/utils')
const { APIError, APIErrorTypes } = require('../helpers/errors')


const getPerson = async(req, res, next) => {
    try {
        const { username } = req.params
        if (req.auth.username != username)
            throw new APIError(APIErrorTypes.NotAuthorized, "Cannot access from another person", true)
        var p = await personService.getPerson(username)
        var fieldList = ['username', 'firstName', 'lastName']
        res.status(200).json({
            person: pick(p, fieldList)
        });
        next()
    } catch(e) { next(e) }
}

const getPersonDrives = async(req, res, next) => {
    try {
        const { username } = req.params
        if (req.auth.username != username)
            throw new APIError(APIErrorTypes.NotAuthorized, "Cannot access from another person", true)
        const drives = await personService.getPersonDrives(username)
        res.status(200).json({
            drives: drives
        });
    } catch(e) { next(e) }
}

const searchPerson = async(req, res, next) => {
    try {
        const { query } = req.params
        const results = await personService.searchPerson(req.auth.username, query)
        var fieldList = ['username', 'firstName', 'lastName', 'address', 'status']
        res.status(200).json({
            results: pickArray(results, fieldList)
        });
    } catch(e) { next(e) }
}

const getFriends = async(req, res, next) => {
    try {
        const { username } = req.params
        // TODO maybe later allow friends take a look at friends' friends list
        // a.k.a 2nd degree friend list
        if (req.auth.username != username)
            throw new APIError(APIErrorTypes.NotAuthorized, "Cannot access from another person", true)
        const friends = await personService.getFriends(username)
        var fieldList = ['username', 'firstName', 'lastName', 'address', 'status']
        res.status(200).json({
            friends: pickArray(friends, fieldList)
        });
    } catch(e) { next(e) }
}

const updatePerson = async(req, res, next) => {
    try {
        const { username } = req.params
        if (req.auth.username != username)
            throw new APIError(APIErrorTypes.NotAuthorized, "Cannot access from another person", true)
        const updateObj = { firstName, lastName, address } = req.body
        await personService.updatePerson(username, updateObj)
        res.status(200).json({ "success" : true })
    } catch(e) { next(e) }
}

const addFriend = async(req, res, next) => {
    try {
        const { username } = req.params
        const status = await personService.addFriend(req.auth.username, username)
        res.status(200).json({ "status" : status })
    } catch(e) { next(e) }
}

const deleteFriend = async(req, res, next) => {
    try {
        const { username } = req.params
        await personService.deleteFriend(req.auth.username, username)
        res.status(200).json({ "success" : true })
    } catch(e) { next(e) }
}

module.exports = {
    getPerson,
    getPersonDrives,
    searchPerson,
    updatePerson,
    getFriends,
    addFriend,
    deleteFriend
}