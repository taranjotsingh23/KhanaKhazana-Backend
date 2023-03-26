const router = require("express").Router();
const ngoFile = require("../model/ngoFile");
const admin = require("firebase-admin");

const db=admin.firestore();

router.post("/ngoWork", async (req, res) => {
    let ngoId=req.body.ngoId;

    let ngoDistributionsFinding= await ngoFile.find({ ngoId: ngoId });

    let arr=[];

    for(let j=0;j<ngoDistributionsFinding.length;j++)
    {
        let x={
            ...ngoDistributionsFinding[j]
        };
        let k=x._doc;
    
        const snapshot=await db.collection("ngoUsers").get();
        const list=snapshot.docs.map((doc)=>doc.data());
        
        for(let i=0;i<list.length;i++)
        {
            if(list[i].distributionId == ngoDistributionsFinding[j].distributionId)
            {
                k.fileLink= list[i].foodImgURL;
            }
        }
        arr.push(k);
    }
    
    res.status(200).send({ resCode: 200, ngoWork: arr });
});

module.exports = router;