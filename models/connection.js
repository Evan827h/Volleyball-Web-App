const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectionSchema = new Schema({
    name: {type: String, required: [true, "A Name is Required"]},
    topic: {type: String, required: [true, "A Topic is Required"]},
    details: {type: String, required: [true, "Details are Required"],
            minLength: [10, "the details need at least 10 characters"]},
    date: {type: Date, required: [true, "A Date is Required"]},
    rec: {type: String},
    startTime: {type: String, required: [true, "A Starting Time is Required"]},
    endTime: {type: String, required: [true, "An Ending Time is Required"]},
    host: {type: Schema.Types.ObjectId, ref: 'User'},
    location: {type: String, required: [true, "A Location is Required"]},
    img: {type: String, required: [true, "An Image URL is Required"]},
},
{timestamps: true}
);

module.exports = mongoose.model('Connection', connectionSchema);