const { Drive } = require('./drive')
const { Person } = require('./person')
const { Friendship, FriendshipStatus } = require('./friendship')

console.log("modules index")

module.exports = {
    Drive,
    Person,
    Friendship,
    FriendshipStatus
}