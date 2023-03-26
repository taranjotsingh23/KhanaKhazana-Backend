const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ngoFileSchema = new Schema({
    distributionId: { type: String, required: true },
    ngoId: { type: String, required: true },
    foodQuantity: { type: Number, required: true },
    currDate: { type: String, required: true },
}, { timestamps: true })


module.exports = mongoose.model('ngoFile', ngoFileSchema);