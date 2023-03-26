const { number } = require('@hapi/joi');
const mongoose=require('mongoose');

const publicUserSchema= new mongoose.Schema({
    publicId: {
        type: String,
        default: "Null"
    },
    publicName: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    publicEmail: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    publicMobileNumber: {
        type: String,
        required: true,
        max: 10,
        min: 10
    },
    publicAddress: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    publicArea: {
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

module.exports=mongoose.model('publicUser',publicUserSchema);