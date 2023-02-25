const router = require("express").Router();
const ngoUser = require("../model/ngoUser");
const resUser = require("../model/resUser");
const verify= require('./verifyToken');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// const {readFileSync, promises: fsPromises} = require('fs');

// const cors = require("cors");
// router.use(cors({
//   'Access-Control-Allow-Origin':'*'
// }));

const {
  registerValidation,
  loginValidation
} = require("../validation");
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));

var otp = 0;
var expAt = "";

var SibApiV3Sdk = require("sib-api-v3-sdk");
const { db } = require("../model/ngoUser");
const { Collection } = require("mongoose");
SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
  process.env.API_KEY;

function random() {
  otp = Math.floor(100000 + Math.random() * 900000);
  return otp;
}


//--------------------------------Signup--------------------------------------------------------------------------------
router.post("/signup", async (req, res) => {
  var isEmailinDb=false;
  var userType=req.body.userType;
  //Lets validate the data before we make a user
  const { error } = registerValidation(req.body);
  if (error)
    return res
      .status(400)
      .send({
        resCode: 400,
        message: error.details[0].message,
        name: "",
        email: "",
        userType: ""
      });


  if(userType=="NGO")
  {
    //Checking if the user is already in the database
    const emailExist = await ngoUser.findOne({ ngoEmail: req.body.email });
    if(emailExist) {
      return res
        .status(400)
        .send({
          resCode: 400,
          message: "Email already exists",
          name: "",
          email: "",
          userType: userType
        });
    }
  
    if(emailExist) {
      isEmailinDb=true;
    }

    //Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
    //Create a new user
    const user = new ngoUser({
      ngoId: "Null",
      ngoName: req.body.name,
      ngoEmail: req.body.email,
      ngoMobileNumber: req.body.mobileNumber,
      ngoAddress: req.body.address,
      ngoArea: req.body.area,
      password: hashedPassword,
      authToken: "No Token",
    });
  
    if(isEmailinDb==false) {
      var savedUser = await user.save();
      var dbObject = await ngoUser.findOne({ ngoEmail: req.body.email });
      var newuserId=dbObject._id.toString();
      var ngoId=newuserId.substring(0,24);
      var dbResponse=await db.collection("ngousers").updateOne(
        { ngoEmail: req.body.email },
        { $set: { ngoId: ngoId } }
      );
    }

    var collection = db.collection("ngousers");
    var email = req.body.email;
    //Create and assign a token
    const token = jwt.sign({ _id: ngoUser._id }, process.env.TOKEN_SECRET);
    res.header("auth-token", token);
    collection.updateOne({ ngoEmail: email }, { $set: { authToken: token } });
    var dbObject = await ngoUser.findOne({ ngoEmail: email });
    var newuserId=dbObject._id.toString();
    var ngoId=newuserId.substring(0,24);
    res
      .status(200)
      .send({
        resCode: 200,
        message: "User Successfully Registered",
        authToken: token,
        userId: ngoId,
        userType: userType
      });
  }
  else
  {
    //Checking if the user is already in the database
    const emailExist = await resUser.findOne({ resEmail: req.body.email });
    if(emailExist) {
      return res
        .status(400)
        .send({
          resCode: 400,
          message: "Email already exists",
          name: "",
          email: "",
          userType: userType
        });
    }
  
    if(emailExist) {
      isEmailinDb=true;
    }

    //Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
    //Create a new user
    const user = new resUser({
      resId: "Null",
      resName: req.body.name,
      resEmail: req.body.email,
      resMobileNumber: req.body.mobileNumber,
      resAddress: req.body.address,
      resArea: req.body.area,
      password: hashedPassword,
      authToken: "No Token",
    });
  
    if(isEmailinDb==false) {
      var savedUser = await user.save();
      var dbObject = await resUser.findOne({ resEmail: req.body.email });
      var newuserId=dbObject._id.toString();
      var resId=newuserId.substring(0,24);
      var dbResponse=await db.collection("resusers").updateOne(
        { resEmail: req.body.email },
        { $set: { resId: resId } }
      );
    }

      var collection = db.collection("resusers");
      var email = req.body.email;

      //Create and assign a token
      const token = jwt.sign({ _id: resUser._id }, process.env.TOKEN_SECRET);
      res.header("auth-token", token);
      collection.updateOne({ resEmail: email }, { $set: { authToken: token } });
      var dbObject = await resUser.findOne({ resEmail: email });
      var newuserId=dbObject._id.toString();
      var resId=newuserId.substring(0,24);
      res
        .status(200)
        .send({
          resCode: 200,
          message: "User Successfully Registered",
          authToken: token,
          userId: resId,
          userType: userType
        });
  }

});


//Login
router.post("/login", async (req, res) => {
  //Lets validate the data before we make a user
  const { error } = loginValidation(req.body);
  if (error)
    return res
      .status(400)
      .send({
        resCode: 400,
        message: error.details[0].message,
        name: "",
        email: "",
        authToken: "",
        userId: ""
      });

      //Checking if the email exists
      const NGOuser = await ngoUser.findOne({ ngoEmail: req.body.email });
      const RESuser = await resUser.findOne({ resEmail: req.body.email });
      let isRes=false;
      let isNgo=true;
      if (!NGOuser)
      {
        if(!RESuser)
        {
          return res
          .status(400)
          .send({
            resCode: 400,
            message: "Email not found",
            name: "",
            email: "",
            authToken: "",
            userId: "",
            userType: ""
          });
        }
        isRes=true;
        isNgo=false;
      }
      
      var user;
      if(isNgo==true)
      {
        user=NGOuser;
      }
      else
      {
        user=RESuser;
      }

      //Password is correct
      var validPass = await bcrypt.compare(req.body.password, user.password);
      if (!validPass)
        return res
          .status(400)
          .send({
            resCode: 400,
            message: "Invalid Password",
            name: "",
            email: "",
            authToken: "",
            userId: "",
            userType: ""
          });

      if(isNgo==true)
      {
        var dbObject = await ngoUser.findOne({ ngoEmail: req.body.email });
        var newuserId=dbObject._id.toString();
        var ngoId=newuserId.substring(0,24);

        ngoUser.find({ ngoEmail: req.body.email }, function (err, val) {
          const token = val[0].authToken;
          return res
            .status(200)
            .send({
              resCode: 200,
              message: "Logged in!",
              name: user.ngoName,
              email: user.ngoEmail,
              authToken: token,
              userId: ngoId,
              userType: "NGO"
            });
        });
      }
      else
      {
        var dbObject = await resUser.findOne({ resEmail: req.body.email });
        var newuserId=dbObject._id.toString();
        var resId=newuserId.substring(0,24);

        resUser.find({ resEmail: req.body.email }, function (err, val) {
          const token = val[0].authToken;
          return res
            .status(200)
            .send({
              resCode: 200,
              message: "Logged in!",
              name: user.resName,
              email: user.resEmail,
              authToken: token,
              userId: resId,
              userType: "Res"
            });
        });
      }
});



module.exports = router;
