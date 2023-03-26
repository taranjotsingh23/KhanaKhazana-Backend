const router = require("express").Router();
const publicUser = require("../model/publicUser");

router.get("/publicDetails/:publicId", async (req, res) => {
    var publicId=req.params.publicId;

    let publicInfoFinding= await publicUser.findOne({ publicId: publicId });

    let x={
        ...publicInfoFinding
    };
    let k=x._doc;

    delete k._id; 
    delete k.password;
    delete k.otp;
    delete k.date;
    delete k.__v;

    return res.send(k);
});


module.exports = router;