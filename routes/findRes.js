const router = require("express").Router();
const file = require("../model/file");
const resUser = require("../model/resUser");

router.post("/findRes", async (req, res) => {
    var area=req.body.area;

    //Forming Current Date
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    // This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${day}-${month}-${year}`;
    // console.log(currentDate); // "17-6-2022"

    const dbFinding = await resUser.find({ resArea: area });
    let arr=[];
    for(let i=0;i<dbFinding.length;i++)
    {
       arr.push(dbFinding[i].resId);
    }

    let obj={};
    let z=0;
    for(let j=0;j<arr.length;j++)
    {
        z=j;
        let found=await file.findOne({ resId: arr[j], orderStatus: "Pending", currDate: currentDate });
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
            k.fileLink= `${process.env.APP_BASE_URL}/files/${k.uuid}`;
            delete k._id; 
            delete k.createdAt;
            delete k.updatedAt;
            delete k.__v;
            obj[++z] = k;
        }
    }
    return res.send(obj);
});

module.exports = router;