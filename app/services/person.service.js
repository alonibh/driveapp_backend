const { Person } = require('../models/person')
const { Friendship, FriendshipStatus } = require('../models/friendship')
const { APIError, APIErrorTypes } = require('../helpers/errors')
const { pick, pickArray } = require('../helpers/utils')

const getFriendshipModel = async (firstFriendId, secondFriendId) => {
    return await Friendship.findOne({ 
        $or: [
            { $and: [{ senderFriend: firstFriendId, responderFriend: secondFriendId }] },
            { $and: [{ senderFriend: secondFriendId, responderFriend: firstFriendId }] },
        ]
    }).populate('senderFriend responderFriend', 'username')
}

const getPerson = async(username) => {
    const p = await Person.findOne({ username: username }).select('-_id -__v -password').lean()
    if (!p)
        throw new APIError(APIErrorTypes.PersonNotFound, username, true);
    return p;
};

const getPersonDrives = async(username) => {
    const p = await Person.findOne({ username: username }).populate({
        path: 'drives', 
        populate: {
            path: 'driver participants',
            select: 'username firstName lastName address'
        },
        select: '-__v'
    }).lean()
    if (!p)
        throw new APIError(APIErrorTypes.PersonNotFound, username, true);

    var fieldList = ['username', 'firstName', 'lastName', 'address']
    p.drives.forEach(d => {
        d.driver = pick(d.driver, fieldList)
        d.participants = pickArray(d.participants, fieldList)
    });
    
    return p.drives;
};

const searchPerson = async(username, query) => {
    const serializedResults = [];
    const results = await Person.find({ $and: [
        { username: { $ne: username } },
        { $or: [
            { username: { $regex: new RegExp('^' + query, 'i') }},
            { firstName: { $regex: new RegExp('^' + query, 'i') }},
            { lastName: { $regex: new RegExp('^' + query, 'i') }}
        ]}
    ]}).select('-password -_id -__v').lean()
    
    const myFriends = await getFriends(username)
    
    results.forEach((p) => {
        let result = {
            username: p.username,
            firstName: p.firstName,
            lastName: p.lastName,
            address: null,
            status: null
        }
        let friendship = myFriends.find((o) => o.username === p.username)
        if (friendship) {
            result.address = p.address
            result.status = friendship.status
        }

        serializedResults.push(result)
    })
    
    return serializedResults;
}

const updatePerson = async(username, updateObj) => {
    const p = await Person.findOneAndUpdate({ username: username }, updateObj, {new: true})
    if (!p)
        throw new APIError(APIErrorTypes.PersonNotFound, null, true)

    return true;
}
const deleteFriend = async(username, friendUsername) => {
    const firstFriend = await Person.findOne({ username: username }, '_id')
    const secondFriend = await Person.findOne({ username: friendUsername }, '_id')
    if (!firstFriend) {
        throw new APIError(APIErrorTypes.PersonNotFound, username, true) // WTF?!
    }
    if (!secondFriend) {
        throw new APIError(APIErrorTypes.PersonNotFound, friendUsername, true) // Legit
    }

    const friendshipModel = await getFriendshipModel(firstFriend._id, secondFriend._id)
    if (!friendshipModel)
        throw new APIError(APIErrorTypes.PersonNotFriend, friendUsername, true)

    await friendshipModel.delete()
    return true;
}

const addFriend = async(username, friendUsername) => {
    if (username == friendUsername)
        throw new APIError(APIErrorTypes.PersonAlreadyFriend, "Youself", true)

    const firstFriend = await Person.findOne({ username: username }, '_id')
    const secondFriend = await Person.findOne({ username: friendUsername }, '_id')
    if (!firstFriend) {
        throw new APIError(APIErrorTypes.PersonNotFound, username, true) // WTF?!
    }
    if (!secondFriend) {
        throw new APIError(APIErrorTypes.PersonNotFound, friendUsername, true) // Legit
    }
    const friendshipModel = await getFriendshipModel(firstFriend._id, secondFriend._id)
    
    // To send friend request
    if (!friendshipModel) {
        await new Friendship({
            senderFriend: firstFriend._id,
            responderFriend: secondFriend._id,
            status: FriendshipStatus.Pending
        }).save()
        return FriendshipStatus.Pending;
    }
    
    // To confirm
    if (friendshipModel.status == FriendshipStatus.Pending) {
        if (friendshipModel.responderFriend.username == username) {     // Confirm friendship
            // TODO maybe replace with just update() for the model
            await Friendship.findOneAndUpdate({ _id: friendshipModel._id }, { status: FriendshipStatus.Accepted }, { new: true })
            return FriendshipStatus.Accepted;
        }
        else if (friendshipModel.senderFriend.username == username)     // Can't send request twice
            throw new APIError(APIErrorTypes.PersonAlreadyFriend, friendshipModel.status, true)
        else
            throw new APIError("Unknown state of Friendship object", friendshipModel, false)
    }
    else if (friendshipModel.status == FriendshipStatus.Accepted)
        throw new APIError(APIErrorTypes.PersonAlreadyFriend, friendshipModel.status, true)
    
    throw new APIError("Unknown friendship status", friendshipModel.status, false)
}

const getFriends = async(username) => {
    const currentPerson = await Person.findOne({ username: username }, '_id')
    const populatedFriends = await Friendship.find({ 
        $or: [
            { senderFriend: currentPerson._id },
            { responderFriend: currentPerson._id }
        ]
    }).populate('senderFriend responderFriend', 'username firstName lastName').lean()

    // Serialize DB data
    const serializedFriends = []
    populatedFriends.forEach((friendshipObj) => {
        let f;
        if (friendshipObj.senderFriend.username == username)
            f = friendshipObj.responderFriend;
        else
            f = friendshipObj.senderFriend;

        if (friendshipObj.status == FriendshipStatus.Pending && friendshipObj.responderFriend.username == username)
            friendshipObj.status = FriendshipStatus.WaitingForApproval

        serializedFriends.push({
            username: f.username,
            firstName: f.firstName,
            lastName: f.lastName,
            status: friendshipObj.status
        })
    })
    return serializedFriends;
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
