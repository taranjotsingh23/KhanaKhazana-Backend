const router = require("express").Router();
const ngoFile = require("../model/ngoFile");

router.post("/ngoDistribution", async (req, res) => {
    let ngoId=req.body.ngoId;

    let ngoDistributionsFinding= await ngoFile.find({ ngoId: ngoId });
 
    res.status(200).send({ resCode: 200, ngoDistributions: ngoDistributionsFinding });
});

module.exports = router;