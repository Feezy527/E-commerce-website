const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    orderItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            quantity: Number, 
        },
    ],
    totalPrice: {
        type: Number, 
        required: true, 
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        default: "pending", // pendingg, shipped, delivered
    },
}, {timestamps: true});

module.exports = mongoose.model("Order", orderSchema);