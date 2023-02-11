const router = require("express").Router();
const ngoUser = require("../model/ngoUser");

router.get("/ngoDetails/:ngoId", async (req, res) => {
    var ngoId=req.params.ngoId;

    let ngoInfoFinding= await ngoUser.findOne({ ngoId: ngoId });

    let x={
        ...ngoInfoFinding
    };
    let k=x._doc;

    delete k._id; 
    delete k.password;
    delete k.otp;
    delete k.date;
    delete k.__v;

    return res.send(k);
});

router.patch("/ngoDetails/:ngoId", async (req, res) => {
    try {
        var ngoId=req.params.ngoId;
        const updateNgo = await ngoUser.findByIdAndUpdate(ngoId, req.body, {new: true});
        res.status(200).send(updateNgo);
    }
    catch(e) {
        res.status(400).send(updateNgo);
    }
})

module.exports = router;