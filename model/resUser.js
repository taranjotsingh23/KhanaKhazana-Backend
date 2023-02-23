const { number } = require('@hapi/joi');
const mongoose=require('mongoose');

const resUserSchema= new mongoose.Schema({
    resId: {
        type: String,
        default: "Null"
    },
    resName: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    resEmail: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    resMobileNumber: {
        type: String,
        required: true,
        max: 10,
        min: 10
    },
    resAddress: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    resArea: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    stars: {
        type: Number,
        required: true,
        default: 0
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

module.exports=mongoose.model('resUser',resUserSchema);