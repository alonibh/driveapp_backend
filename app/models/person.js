const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const personSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    drives: [{ type: Schema.Types.ObjectId, ref: 'Drive', required: true }],
    friends: [{ type: Schema.Types.ObjectId, ref: 'Friendship', required: true }],
});

var Person = mongoose.model('Person', personSchema);

module.exports = {
    Person
}