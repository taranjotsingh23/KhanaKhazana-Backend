const router = require("express").Router();
const resUser = require("../model/resUser");

router.get("/resDetails/:resId", async (req, res) => {
    var resId=req.params.resId;

    let resInfoFinding= await resUser.findOne({ resId: resId });

    let x={
        ...resInfoFinding
    };
    let k=x._doc;

    delete k._id; 
    delete k.password;
    delete k.otp;
    delete k.date;
    delete k.__v;

    return res.send(k);
});

router.patch("/resDetails/:resId", async (req, res) => {
    try {
        var resId=req.params.resId;
        const updateRes = await resUser.findByIdAndUpdate(resId, req.body, {new: true});
        res.status(200).send(updateRes);
    }
    catch(e) {
        res.status(400).send(updateRes);
    }
})

module.exports = router;