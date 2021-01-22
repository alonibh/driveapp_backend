const { Drive } = require('../models/drive')
const { Person } = require('../models/person')
const { APIError, APIErrorTypes } = require('../helpers/errors')

const setDriveToPersons = async (drive) => {
    // TODO maybe change to update()
    for await (const p of drive.participants) {
        await Person.findOneAndUpdate({ _id: p._id }, { $addToSet: { drives: drive._id }})
    }
    
    await Person.updateMany({ drives: drive._id, _id: { $nin: drive.participants }},
        { $pull: { drives: drive._id }})
}

const isPersonParticipant = async(username, driveId) => {
    const d = await Drive.findOne({ _id: driveId }).populate('participants', 'username').lean()
    if (!d)
        throw new APIError(APIErrorTypes.DriveNotFound, id, true);
    d.participants = d.participants.map((p) => p.username)
    return d.participants.includes(username)
}

const addDrive = async (driveObj) => {
    const driver = await Person.findOne({ username: driveObj.driver })
    if (!driver)
        throw new APIError(APIErrorTypes.PersonNotFound, driveObj.driver, true)

    const participants = await Person.find({ username: { $in: driveObj.participants }})
    
    // Check if user participants and model participants are equal and everyone exists
    if (Object.values(participants.map((o) => o.username)).some(o => !driveObj.participants.includes(o)) ||
        participants.length != driveObj.participants.length)
        throw new APIError(APIErrorTypes.PersonNotFound, null, true)
    
    const d = await new Drive({
        dest: driveObj.dest,
        date: driveObj.date,
        driver,
        participants
    }).save()

    await setDriveToPersons(d)
    return d.toJSON()
}

const getDrive = async (id) => {
    const d = await Drive.findOne({ _id: id }, '-__v').
        populate('driver participants', 'username firstName lastName address').lean()
    if (!d)
        throw new APIError(APIErrorTypes.DriveNotFound, id, true);

    return d
};

const deleteDrive = async (id) => {
    const d = await Drive.findOneAndDelete({ _id: id }).populate('participants')
    if (!d)
        throw new APIError(APIErrorTypes.DriveNotFound, id, true);
    
    for await (const pDrive of d.participants) {
        await Person.findOneAndUpdate({ _id: pDrive._id }, { $pull: { drives: d._id }}, {new: true})
    }
};

const updateDrive = async (id, updateObj) => {
    const populatedUpdateObj = { dest, date } = updateObj
    
    if (updateObj.driver) {
        let driver = await Person.findOne({ username: driveObj.driver })
        if (!driver)
            throw new APIError(APIErrorTypes.PersonNotFound, driveObj.driver, true)
        populatedUpdateObj.driver = driver
    }

    if (updateObj.participants) {
        let participants = await Person.find({ username: { $in: updateObj.participants }})
        
        // Check if user participants and model participants are equal and everyone exists
        if (Object.values(participants.map((o) => o.username)).some(o => !updateObj.participants.includes(o)) ||
            participants.length != updateObj.participants.length)
            throw new APIError(APIErrorTypes.PersonNotFound, null, true)
        
        populatedUpdateObj.participants = participants
    }

    const d = await Drive.findOneAndUpdate({ _id: id }, populatedUpdateObj, {new: true}).lean()
    if (!d)
        throw new APIError(APIErrorTypes.DriveNotFound, null, true)

    await setDriveToPersons(d)
};

module.exports = {
    addDrive,
    getDrive,
    deleteDrive,
    updateDrive,
    isPersonParticipant
}