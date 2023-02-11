const router = require("express").Router();
const resUser = require("../model/resUser");

router.post("/giveStars", async (req, res) => {
    var resId=req.body.resId;
    var giveStar=req.body.giveStar;

    let resFinding= await resUser.findOne({ resId: resId });
    let currStars=resFinding.stars;

    if(currStars==0)
    {
        const updated_Stars = await resUser.findOneAndUpdate(
            { resId: resId },
            { stars: giveStar }
        );
    }
    else
    {
        let avg=(currStars+giveStar)/2;
        const updated_Star = await resUser.findOneAndUpdate(
            { resId: resId },
            { stars: avg }
        );
    }

    res.status(200).send({ resCode: 200, message: "Stars given successfully!" });
});

module.exports = router;