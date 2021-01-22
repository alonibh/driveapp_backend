const { driveService } = require('../services')
const { APIError, APIErrorTypes } = require('../helpers/errors')
const { pick, pickArray } = require('../helpers/utils')


const addDrive = async(req, res, next) => {
    try {
        const driveObj = { dest, date, driver, participants } = req.body
        if (!participants.includes(req.auth.username))
            throw new APIError(APIErrorTypes.NotAuthorized, "Creator person must be a participant", true)
        if (Object.values(driveObj).some(o => o === null))
            throw new APIError(APIErrorTypes.NullParameters, null, true)
        
        const d = await driveService.addDrive(driveObj)
        res.status(200).json({ 
            "success" : true,
            "_id": d._id 
        })
    } catch(e) { next(e) }
}

const getDrive = async(req, res, next) => {
    try {
        const { id } = req.params
        const d = await driveService.getDrive(id)
        
        // TOOD move to other place - auth check
        const participantsUsernames = d.participants.map((p) => p.username)
        if (!participantsUsernames.includes(req.auth.username))
            throw new APIError(APIErrorTypes.NotAuthorized, "Person must be a participant", true)
        
        var fieldList = ['username', 'firstName', 'lastName', 'address']
        d.driver = pick(d.driver, fieldList)
        d.participants = pickArray(d.participants, fieldList)

        res.status(200).json({
            drive: d
        })
    } catch(e) { next(e) }
}

const deleteDrive = async(req, res, next) => {
    try {
        const { id } = req.params
        const isParticipant = await driveService.isPersonParticipant(req.auth.username, id)
        if (!isParticipant)
            throw new APIError(APIErrorTypes.NotAuthorized, "Person must be a participant", true)
        await driveService.deleteDrive(id)
        res.status(200).json({ "success" : true })
    } catch(e) { next(e) }
}

const updateDrive = async(req, res, next) => {
    try {
        const { id } = req.params
        const updateObj = { dest, date, driver, participants } = req.body
        const isParticipant = await driveService.isPersonParticipant(req.auth.username, id)
        if (!isParticipant)
            throw new APIError(APIErrorTypes.NotAuthorized, "Person must be a participant", true)
        await driveService.updateDrive(id, updateObj)
        res.status(200).json({ "success" : true })
    } catch(e) { next(e) }
}

module.exports = {
    addDrive,
    getDrive,
    deleteDrive,
    updateDrive
}