const router = require("express").Router();
const ngoUser = require("../model/ngoUser");
const resUser = require("../model/resUser");
const verify= require('./verifyToken');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// const {readFileSync, promises: fsPromises} = require('fs');

// const cors = require("cors");
// router.use(cors({
//   origin: "*",
// }));

const {
  registerValidation,
  loginValidation,
  resendOtpValidation,
  otpValidation,
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
      });


  if(userType=="NGO")
  {
    //Checking if the user is already in the database
    const emailExist = await ngoUser.findOne({ ngoEmail: req.body.email });
    if(emailExist && emailExist.otp==1) {
      return res
        .status(400)
        .send({
          resCode: 400,
          message: "Email already exists",
          name: "",
          email: "",
        });
    }
  
    if(emailExist && emailExist.otp!=1) {
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

    try {
      var otp = random();
      new SibApiV3Sdk.TransactionalEmailsApi()
        .sendTransacEmail({
          subject: "OTP for Verify",
          sender: { email: "api@sendinblue.com", name: "Khana Khazana" },
          replyTo: { email: "api@sendinblue.com", name: "Khana Khazana" },
          to: [{ name: user.ngoName, email: user.ngoEmail }],
          htmlContent:
            "<html><body><h1>Your One time password is  " +
            otp +
            " {{params.bodyMessage}}</h1></body></html>",
          params: { bodyMessage: "   It is valid for 10 mins." },
        })
        .then(
          async function (data) {
            createdAt = Date.now();
            expAt = Date.now() + 360000;
            res
              .status(200)
              .send({
                resCode: 200,
                message: "OTP sent on Email",
                name: user.ngoName,
                email: user.ngoEmail,
              });
            const updated_otp = await ngoUser.findOneAndUpdate(
              { ngoEmail: user.ngoEmail },
              { otp: otp }
            );
          },
          function (error) {
            console.error(error);
          }
        );
    } catch (err) {
      res.status(400).send({ resCode: 400, message: err, name: "", email: "" });
    }
  }
  else
  {
    //Checking if the user is already in the database
    const emailExist = await resUser.findOne({ resEmail: req.body.email });
    if(emailExist && emailExist.otp==1) {
      return res
        .status(400)
        .send({
          resCode: 400,
          message: "Email already exists",
          name: "",
          email: "",
        });
    }
  
    if(emailExist && emailExist.otp!=1) {
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

    try {
      var otp = random();
      new SibApiV3Sdk.TransactionalEmailsApi()
        .sendTransacEmail({
          subject: "OTP for Verify",
          sender: { email: "api@sendinblue.com", name: "Khana Khazana" },
          replyTo: { email: "api@sendinblue.com", name: "Khana Khazana" },
          to: [{ name: user.resName, email: user.resEmail }],
          htmlContent:
            "<html><body><h1>Your One time password is  " +
            otp +
            " {{params.bodyMessage}}</h1></body></html>",
          params: { bodyMessage: "   It is valid for 10 mins." },
        })
        .then(
          async function (data) {
            createdAt = Date.now();
            expAt = Date.now() + 360000;
            res
              .status(200)
              .send({
                resCode: 200,
                message: "OTP sent on Email",
                name: user.resName,
                email: user.resEmail,
              });
            const updated_otp = await resUser.findOneAndUpdate(
              { resEmail: user.resEmail },
              { otp: otp }
            );
          },
          function (error) {
            console.error(error);
          }
        );
    } catch (err) {
      res.status(400).send({ resCode: 400, message: err, name: "", email: "" });
    }
  }

});


//Login
router.post("/login", async (req, res) => {
  var userType=req.body.userType;
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

    if(userType=="NGO")
    {
      //Checking if the email exists
      const user = await ngoUser.findOne({ ngoEmail: req.body.email });
      if (!user)
        return res
          .status(400)
          .send({
            resCode: 400,
            message: "Email not found",
            name: "",
            email: "",
            authToken: "",
            userId: ""
          });
    
      //Password is correct
      const validPass = await bcrypt.compare(req.body.password, user.password);
      if (!validPass)
        return res
          .status(400)
          .send({
            resCode: 400,
            message: "Invalid Password",
            name: "",
            email: "",
            authToken: "",
            userId: ""
          });
    
      var dbObject = await ngoUser.findOne({ ngoEmail: req.body.email });
      var newuserId=dbObject._id.toString();
      var ngoId=newuserId.substring(0,24);
    
      const checkOtp = await ngoUser.findOne({ ngoEmail: req.body.email });
      if (checkOtp.otp != 1) {
        return res
          .status(400)
          .send({
            resCode: 400,
            message: "Email not Verified using OTP",
            name: user.ngoName,
            email: user.ngoEmail,
            authToken: "",
            userId: ""
          });
      } else {
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
              userId: ngoId
            });
        });
      }
    }
    else
    {
      //Checking if the email exists
      const user = await resUser.findOne({ resEmail: req.body.email });
      if (!user)
        return res
          .status(400)
          .send({
            resCode: 400,
            message: "Email not found",
            name: "",
            email: "",
            authToken: "",
            userId: ""
          });
    
      //Password is correct
      const validPass = await bcrypt.compare(req.body.password, user.password);
      if (!validPass)
        return res
          .status(400)
          .send({
            resCode: 400,
            message: "Invalid Password",
            name: "",
            email: "",
            authToken: "",
            userId: ""
          });
    
      var dbObject = await resUser.findOne({ resEmail: req.body.email });
      var newuserId=dbObject._id.toString();
      var resId=newuserId.substring(0,24);
    
      const checkOtp = await resUser.findOne({ resEmail: req.body.email });
      if (checkOtp.otp != 1) {
        return res
          .status(400)
          .send({
            resCode: 400,
            message: "Email not Verified using OTP",
            name: user.resName,
            email: user.resEmail,
            authToken: "",
            userId: ""
          });
      } else {
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
              userId: resId
            });
        });
      }
    }
});



//OTP
router.post("/otp", async function (req, res) {
  var userType=req.body.userType;
  //Lets validate the data before we make a user
  const { error } = otpValidation(req.body);
  if (error)
    return res
      .status(400)
      .send({ resCode: 400, message: error.details[0].message, authToken: "", userId: "" });

    if(userType=="NGO")
    {
      var collection = db.collection("ngousers");
      var email = req.body.email;
      var checkVal = req.body.responseFrom;
    
      if (checkVal == 6) {
        const otp_stored = await ngoUser.findOne({ ngoEmail: email }, { otp: 1 });
        const otp_check = req.body.otp;
        if (otp_stored.otp == otp_check) {
          var curr = Date.now();
          if (curr > expAt) {
            res.status(400).send({ resCode: 400, message: "OTP Expired", authToken: "", userId: "" });
          } 
          else {
            //Create and assign a token
            const token = jwt.sign({ _id: ngoUser._id }, process.env.TOKEN_SECRET);
            res.header("auth-token", token);
            collection.updateOne({ ngoEmail: email }, { $set: { authToken: token } });
            collection.updateOne({ ngoEmail: email }, { $set: { otp: 1 } });
            var dbObject = await ngoUser.findOne({ ngoEmail: email });
            var newuserId=dbObject._id.toString();
            var ngoId=newuserId.substring(0,24);
            res
              .status(200)
              .send({
                resCode: 200,
                message: "User Successfully Registered",
                authToken: token,
                userId: ngoId
              });
          }
        } else {
          res
            .status(400)
            .send({ resCode: 400, message: "Invalid OTP", authToken: "", userId: "" });
        }
      } else if (checkVal == 8) {
        //---------------------For Forget Password Work----------------------------------------------------------------
        
        const otp_stored = await ngoUser.findOne({ ngoEmail: email }, { otp: 1 });
        const otp_check = req.body.otp;
        if (otp_stored.otp == otp_check) {
          var curr = Date.now();
          if (curr > expAt) {
            res.status(400).send({ resCode: 400, message: "OTP Expired", authToken: "", userId: "" });
          } else {
           
            collection.updateOne({ ngoEmail: email }, { $set: { otp: 1 } });
            res
              .status(200)
              .send({ resCode: 200, message: "Email Verified", authToken: "", userId: "" });
          }
        } 
        else {
          res
            .status(400)
            .send({ resCode: 400, message: "Invalid OTP", authToken: "", userId: "" });
        }
      } else {
        res.send("Went to Else for OTP");
      }
    }
    else
    {
      var collection = db.collection("resusers");
      var email = req.body.email;
      var checkVal = req.body.responseFrom;
    
      if (checkVal == 6) {
        const otp_stored = await resUser.findOne({ resEmail: email }, { otp: 1 });
        const otp_check = req.body.otp;
        if (otp_stored.otp == otp_check) {
          var curr = Date.now();
          if (curr > expAt) {
            res.status(400).send({ resCode: 400, message: "OTP Expired", authToken: "", userId: "" });
          } 
          else {
            //Create and assign a token
            const token = jwt.sign({ _id: resUser._id }, process.env.TOKEN_SECRET);
            res.header("auth-token", token);
            collection.updateOne({ resEmail: email }, { $set: { authToken: token } });
            collection.updateOne({ resEmail: email }, { $set: { otp: 1 } });
            var dbObject = await resUser.findOne({ resEmail: email });
            var newuserId=dbObject._id.toString();
            var resId=newuserId.substring(0,24);
            res
              .status(200)
              .send({
                resCode: 200,
                message: "User Successfully Registered",
                authToken: token,
                userId: resId
              });
          }
        } else {
          res
            .status(400)
            .send({ resCode: 400, message: "Invalid OTP", authToken: "", userId: "" });
        }
      } else if (checkVal == 8) {
        //---------------------For Forget Password Work----------------------------------------------------------------
        
        const otp_stored = await resUser.findOne({ resEmail: email }, { otp: 1 });
        const otp_check = req.body.otp;
        if (otp_stored.otp == otp_check) {
          var curr = Date.now();
          if (curr > expAt) {
            res.status(400).send({ resCode: 400, message: "OTP Expired", authToken: "", userId: "" });
          } else {
           
            collection.updateOne({ resEmail: email }, { $set: { otp: 1 } });
            res
              .status(200)
              .send({ resCode: 200, message: "Email Verified", authToken: "", userId: "" });
          }
        } 
        else {
          res
            .status(400)
            .send({ resCode: 400, message: "Invalid OTP", authToken: "", userId: "" });
        }
      } else {
        res.send("Went to Else for OTP");
      }
    }
});



//Resend OTP
router.post("/resendOTP", async function (req, res) {
  var userType=req.body.userType;
  const { error } = resendOtpValidation(req.body);
  if (error)
    return res
      .status(400)
      .send({
        resCode: 400,
        message: error.details[0].message
      });
  var email = req.body.email;

  if(userType=="NGO")
  {
    var objectFinding = await ngoUser.findOne({ ngoEmail: email });
    if(objectFinding==null)
    {
      return res
      .status(400)
      .send({ resCode: 400, message: "Email doesn't exist"});
    }
  
    try {
      var otp = random();
      new SibApiV3Sdk.TransactionalEmailsApi()
        .sendTransacEmail({
          subject: "OTP for Verify",
          sender: { email: "api@sendinblue.com", name: "Khana Khazana" },
          replyTo: { email: "api@sendinblue.com", name: "Khana Khazana" },
          to: [{ email: email }],
          htmlContent:
            "<html><body><h1>Your One time password is  " +
            otp +
            " {{params.bodyMessage}}</h1></body></html>",
          params: { bodyMessage: "   It is valid for 10 mins." },
        })
        .then(
          function (data) {
            createdAt = Date.now();
            expAt = Date.now() + 360000;
            res.send({
              resCode: 200,
              message: "OTP sent on Email"
            });
            db.collection("ngousers").updateOne(
              { ngoEmail: email },
              { $set: { otp: otp } }
            );
          },
          function (error) {
            console.error(error);
          }
        );
    } catch (err) {
      res.status(400).send({ resCode: 400, message: err});
    }
  }
  else
  {
    var objectFinding = await resUser.findOne({ resEmail: email });
    if(objectFinding==null)
    {
      return res
      .status(400)
      .send({ resCode: 400, message: "Email doesn't exist"});
    }
  
    try {
      var otp = random();
      new SibApiV3Sdk.TransactionalEmailsApi()
        .sendTransacEmail({
          subject: "OTP for Verify",
          sender: { email: "api@sendinblue.com", name: "Khana Khazana" },
          replyTo: { email: "api@sendinblue.com", name: "Khana Khazana" },
          to: [{ email: email }],
          htmlContent:
            "<html><body><h1>Your One time password is  " +
            otp +
            " {{params.bodyMessage}}</h1></body></html>",
          params: { bodyMessage: "   It is valid for 10 mins." },
        })
        .then(
          function (data) {
            createdAt = Date.now();
            expAt = Date.now() + 360000;
            res.send({
              resCode: 200,
              message: "OTP sent on Email"
            });
            db.collection("resusers").updateOne(
              { resEmail: email },
              { $set: { otp: otp } }
            );
          },
          function (error) {
            console.error(error);
          }
        );
    } catch (err) {
      res.status(400).send({ resCode: 400, message: err});
    }
  }

});



//Forgot Password
router.post("/forgetPassword", async function (req, res) {
  var userType=req.body.userType;
  const salt = await bcrypt.genSalt(10);
  hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
  email = req.body.email;
  password = hashedPassword;

  if(userType=="NGO")
  {
    var dbResponse=await db.collection("ngousers").updateOne(
      { ngoEmail: email },
      { $set: { password: password } }
    );
  }
  else
  {
    var dbResponse=await db.collection("resusers").updateOne(
      { resEmail: email },
      { $set: { password: password } }
    );
  }

  if(dbResponse.modifiedCount==1) {
    res.status(200).send({ resCode: 200, message: "Password updated" });
  }
  else
  {
    res.status(400).send({ resCode: 400, message: "Details are not Correct!!" });
  }
});



module.exports = router;
