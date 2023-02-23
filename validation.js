//VALIDATION
const Joi = require('@hapi/joi');

//Register Validation
const registerValidation=(data)=>{
    const schema=Joi.object({
        name:Joi.string().min(3).required(),
        email:Joi.string().required().email(),
        mobileNumber:Joi.string().length(10).pattern(/^[0-9]+$/).required(),
        address:Joi.string().min(3).required(),
        area:Joi.string().min(3).required(),
        password:Joi.string().min(6).required(),
        userType:Joi.string().min(3).required(),
    });
    return schema.validate(data);
};

//Login Validation
const loginValidation=(data)=>{
    const schema=Joi.object({
        email:Joi.string().required().email(),
        password:Joi.string().min(6).required()
    });
    return schema.validate(data);
};

module.exports.registerValidation=registerValidation;
module.exports.loginValidation=loginValidation;