const router = require("express").Router();
const ngoFile = require("../model/ngoFile");
const ngoUser = require("../model/ngoUser");
const admin = require("firebase-admin");

router.post("/findNgo", async (req, res) => {
    var area=req.body.area;

    const db=admin.firestore();
    const dbFinding = await ngoUser.find({ ngoArea: area });
    let arr=[];
    for(let i=0;i<dbFinding.length;i++)
    {
       arr.push(dbFinding[i].ngoId);
    }

    let narr=[];
    for(let j=0;j<arr.length;j++)
    {
        let ngoDeepInfoFinding= await ngoUser.findOne({ ngoId: arr[j] });
        narr.push(ngoDeepInfoFinding);  
    }
    // return res.send(obj);
    res.status(200).send({ resCode: 200, areaNgoDetails: narr });
});

module.exports = router;