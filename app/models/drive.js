const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const driveSchema = new Schema({
    dest: { type: String, required: true },
    date: { type: Date, required: true },
    driver: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: 'Person', required: true }],
});

const Drive = mongoose.model('Drive', driveSchema);

module.exports = {
    Drive
}