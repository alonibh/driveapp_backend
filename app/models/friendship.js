const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FriendshipStatus = {
    Pending:            "Pending",
    Accepted:           "Accepted",
    WaitingForApproval: "WaitingForApproval"
}

const friendshipSchema = new Schema({
    senderFriend: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
    responderFriend: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
    status: { type: String, required: true },
});

var Friendship = mongoose.model('Friendship', friendshipSchema);

module.exports = {
    Friendship,
    FriendshipStatus
}