const express = require('express');
const router = express.Router();
const { client } = require('../paypal/client');
const User = require('../models/User');
const paypal = require('paypal/checkout-server-sdk');

let membership;
if (planId === "P-0j650415FH362491VNAQCFlQ")
    membership = "gold";

if (planId === "P-3RG36489BX4272622NAQCKEA")
    membership = "platinum";

if (planId === "P-339627571K154671RNAQCLQA")
    membership = "diamond";

const user = await User.findOneAndUpdate(
    { pendingSubscriptionId: subscriptionId},
    { membership },
    { new: true }
);

res.json({ message: "Membership upgraded", userId: user._id });


router.post('/create.subscription', async (req, res) => {
    const [planId] = req.body;

    const request = new (require('paypal/checkout-server-sdk')).subscriptionsCreateRequest();
    request.requestBody({
        plan_Id: planId,
        application_context: {
            brand_name: "Flirting Singles",
            user_action: "SUBSCRIBE_NOW",
            return_url: "http://flirtingsingles.blog/payment-success",
            cancel_url: "http://flirtingsingles.blog/payment-cancel"
        }
    });

    try {
        const response = await client().execute(request);
        const approvalUrl = response.result.links.find(link => link.rel === "approve").href;
        res.json({ url: approvalUrl });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating subscription");
    }
});

module.exports = router;
