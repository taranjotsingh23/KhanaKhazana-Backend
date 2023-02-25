const router = require("express").Router();
const file = require("../model/file");

router.post("/orderDone", async (req, res) => {
   let orderId=req.body.orderId;

   const updated_Order = await file.findOneAndUpdate(
    { _id: orderId },
    { orderStatus: "Completed" }
   );

   res.status(200).send({ resCode: 200, message: "Order Completed!!" });
});

module.exports = router;