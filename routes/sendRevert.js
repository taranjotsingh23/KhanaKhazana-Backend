const router = require("express").Router();
const dotenv = require("dotenv");
dotenv.config();
const client = require('twilio')('ACe88864714f411310114f1ee1194179ee', '977bb27000089d1e80daedbf0b6a10c7');

var SibApiV3Sdk = require("sib-api-v3-sdk");
SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey = process.env.API_KEY;

router.post("/sendRevert", async (req, res) => {
    let contactNumber=Number(req.body.mobileNumber);
    // For SMS
    try {
        const message = await client.messages.create({
          body: "Wait, I am coming to take food from you!!",
          to: `+91${contactNumber}`,
          from: process.env.TWILIO_NUMBER,
        });
        // console.log(message);
    } catch (error) {
        console.error(error);
    }


    // For Email
    new SibApiV3Sdk.TransactionalEmailsApi()
      .sendTransacEmail({
        subject: "Regarding Food Collection",
        sender: { email: "api@sendinblue.com", name: "Khana Khazana" },
        replyTo: { email: "api@sendinblue.com", name: "Khana Khazana" },
        to: [{ name: req.body.name, email: req.body.email }],
        htmlContent:
          "<html><body><h1>Wait, I am coming to take food from you!! " +
          " {{params.bodyMessage}}</h1></body></html>",
        params: { bodyMessage: "   Please Wait for me." },
      })
      .then(
        async function (data) {
            res.status(200).send({ resCode: 200, message: "Message sent on SMS, Email Successfully!!" });
        },
        function (error) {
          console.error(error);
        }
      );
});

module.exports = router;