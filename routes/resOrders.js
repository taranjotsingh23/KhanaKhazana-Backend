const router = require("express").Router();
const file = require("../model/file");
const resUser = require("../model/resUser");

router.post("/resOrders", async (req, res) => {
    let resId=req.body.resId;

    let resOrdersFinding= await file.find({ resId: resId });
 
    res.status(200).send({ resCode: 200, resOrders: resOrdersFinding });
});

module.exports = router;