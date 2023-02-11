const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    resId: { type: String, required: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    uuid: { type: String, required: true },
    foodQuantity: { type: Number, required: true },
    foodType: { type: String, required: true },
    orderStatus: { type: String, required: true },
    currDate: { type: String, required: true },

}, { timestamps: true })


module.exports = mongoose.model('File', fileSchema);