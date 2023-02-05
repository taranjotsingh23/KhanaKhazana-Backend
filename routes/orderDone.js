const router = require("express").Router();
const file = require("../model/file");

router.post("/orderDone", async (req, res) => {
   let resId=req.body.resId;

   const updated_Order = await file.findOneAndUpdate(
    { resId: resId },
    { orderStatus: "Completed" }
   );

   res.status(200).send({ resCode: 200, message: "Order Completed!!" });
});

module.exports = router;