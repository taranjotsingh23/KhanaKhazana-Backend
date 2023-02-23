const { number } = require('@hapi/joi');
const mongoose=require('mongoose');

const ngoUserSchema= new mongoose.Schema({
    ngoId: {
        type: String,
        default: "Null"
    },
    ngoName: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    ngoEmail: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    ngoMobileNumber: {
        type: String,
        required: true,
        max: 10,
        min: 10
    },
    ngoAddress: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    ngoArea: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    authToken: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports=mongoose.model('ngoUser',ngoUserSchema);