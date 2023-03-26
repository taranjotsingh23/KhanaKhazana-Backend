const router = require("express").Router();
const ngoFile = require("../model/ngoFile");

router.post("/ngoWork", async (req, res) => {
    let ngoId=req.body.ngoId;

    let ngoDistributionsFinding= await ngoFile.find({ ngoId: ngoId });

    console.log(ngoDistributionsFinding);
    console.log(ngoDistributionsFinding.length);

    let x={
        ...ngoDistributionsFinding[0]
    };

    let k=x._doc;
    k.resName=resDeepInfoFinding.resName;

    const snapshot=await db.collection("ngoUsers").get();
    const list=snapshot.docs.map((doc)=>doc.data());
    
    let barr=[];
    for(let i=0;i<list.length;i++)
    {
        if(list[i].distributionId == ngoDistributionsFinding[0].distributionId)
        {
            barr.push(list[i]);
        }
    }
    console.log(barr)
    k.fileLink= barr[0].foodImgURL;

    // let arr=[];
    // for(let i=0;i<ngoDistributionsFinding.length;i++)
    // {
    //    arr.push(dbFinding[i].resId);
    // }

    // let obj={};
    // let z=1;
    // for(let j=0;j<arr.length;j++)
    // {
    //     let found=await file.findOne({ resId: arr[j], orderStatus: "Pending" });
    //     if(found)
    //     {
    //         let resDeepInfoFinding= await resUser.findOne({ resId: arr[j] });

    //         let x={
    //             ...found
    //         };
    //         let k=x._doc;
    //         k.resName=resDeepInfoFinding.resName;
    //         k.resEmail=resDeepInfoFinding.resEmail;
    //         k.resMobileNumber=resDeepInfoFinding.resMobileNumber;
    //         k.resAddress=resDeepInfoFinding.resAddress;
    //         k.resArea=resDeepInfoFinding.resArea;
    //         k.stars=resDeepInfoFinding.stars;

    //         const snapshot=await db.collection("users").get();
    //         const list=snapshot.docs.map((doc)=>doc.data());
          
    //         let barr=[];
    //         for(let i=0;i<list.length;i++)
    //         {
    //             if(list[i].orderId == found.orderId)
    //             {
    //                 barr.push(list[i]);
    //             }
    //         }

    //         console.log(barr);

    //         k.fileLink= barr[0].foodImgURL;
    //         delete k._id; 
    //         delete k.createdAt;
    //         delete k.updatedAt;
    //         delete k.__v;
    //         obj[z] = k;
    //         z++;
    //     }
    // }
    // return res.send(obj);
 
    // res.status(200).send({ resCode: 200, ngoWork: ngoDistributionsFinding });
});

module.exports = router;