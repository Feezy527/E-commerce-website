const axios = require("axios");
const Order = require("../models/Order");

//Initialize payment
exports.initializePayment = async (req, res) => {
    const {email, amount} = req.body;

    try {
        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email,
                amount: amount * 100, //Paystack uses kobo
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        res.json(response.data);
    } catch (error){
        res.status(500).json({message: error.message});
    }
};

//verify payment
exports.verifyPayment = async (req, res) => {
    const {reference, orderId} = req.body;

    try {
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${proccess.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        if (response.data.data.status === "success") {
            const order = await Order.findById(orderId);

            if (order) {
                order.isPaid = true;
                order.status = "paid";

                await order.save();
            }

            res.json({message: "Payment successful", order });
        } else {
            res.status(400).json({message: "Payment not successful" });
        }
    } catch (error) {
        res.status(500).json({message: error.message });
    }
};