const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const rsvpSchema = new Schema({
    connection: {type: Schema.Types.ObjectId, ref: 'Connection'},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    status: { type: String, required: [true, 'status is required'] },
}
);



module.exports = mongoose.model('rsvp', rsvpSchema);