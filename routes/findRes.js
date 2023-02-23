const router = require("express").Router();
const file = require("../model/file");
const resUser = require("../model/resUser");

router.post("/findRes", async (req, res) => {
    var area=req.body.area;

    const dbFinding = await resUser.find({ resArea: area });
    let arr=[];
    for(let i=0;i<dbFinding.length;i++)
    {
       arr.push(dbFinding[i].resId);
    }

    let obj={};
    let z=1;
    for(let j=0;j<arr.length;j++)
    {
        let found=await file.findOne({ resId: arr[j], orderStatus: "Pending" });
        if(found)
        {
            let resDeepInfoFinding= await resUser.findOne({ resId: arr[j] });

            let x={
                ...found
            };
            let k=x._doc;
            k.resName=resDeepInfoFinding.resName;
            k.resEmail=resDeepInfoFinding.resEmail;
            k.resMobileNumber=resDeepInfoFinding.resMobileNumber;
            k.resAddress=resDeepInfoFinding.resAddress;
            k.resArea=resDeepInfoFinding.resArea;
            k.stars=resDeepInfoFinding.stars;
            k.fileLink= `${process.env.APP_BASE_URL}/files/download/${k.uuid}`;
            delete k._id; 
            delete k.createdAt;
            delete k.updatedAt;
            delete k.__v;
            obj[z] = k;
            z++;
        }
    }
    return res.send(obj);
});

module.exports = router;