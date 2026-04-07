const Order = require("../models/Order");
const Cart = require("../models/Cart");

//Create order (checkout)
exports.createOrder = async (req, res) => {
    try {
        const cart = await Cart.findOne({user: req.user._id}).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({message: "Cart is empty"});
        }

        //Calculate total price
        const totalPrice = cart.items.reduce((acc, item) => {
            return acc + item.product.price * item.quantity;
        }, 0);

        //Create order
        const order = new Order({
            user: req.user._id,
            orderItems: cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
            })),
            totalPrice,
        });

        const createdOrder = await order.save();

        //Clear cart after order
        cart.items = [];
        await cart.save();

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//Get user orders
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({user: req.user._id})
            .populate("orderItems.product");
        
        res.json(orders);
    }catch (error) {
        res.status(500).json({message: error.message});
    }
};

//Admin: Get all orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user")
            .populate("user").populate("orderItems.product");
        
        res.json(orders);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//Admin: update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = req.body.status || order.status;
            order.isPaid = req.body.isPaid ?? order.isPaid;

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({message: "Order not found"});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};