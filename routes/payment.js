const router = require("express").Router();
const Razorpay = require('razorpay');
var instance = new Razorpay({
    key_id: 'rzp_test_VAXrMHtVu0NUgT',
    key_secret: 'klVdsptRvlqPovRotGacseZh',
});


router.post("/payment", async (req, res) => {
    var options = {
        amount: req.body.amount,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11"
    };

    instance.orders.create(options, function(err, order) {
        console.log(order);
        res.send({order: order, orderId: order.id});
    });
 
    // res.status(200).send({ resCode: 200, ngoDistributions: ngoDistributionsFinding });
});

module.exports = router;