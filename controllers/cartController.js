const Cart = require("../models/Cart");

//Add to cart
exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try{
        let cart = await Cart.findOne({user: req.user._id});

        if (!cart) {
            //Create new cart
            cart = new Cart({
                user: req.user._id,
                items: [{product: productId, quantity}],
            });
        } else {
            //Check if product already in cart
            const itemIndex = cart.items.findIndex(
                (item) => item.product.toString() === productId
            );

            if (itemIndex > -1) {
                //Update quantity
                cart.items[itemIndex].quantity += quantity;
            } else {
                //Add new product
                cart.items.push({product: productId, quantity});
            }
        }

        const updatedCart = await cart.save();
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//Get user cart
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({user: req.user._id})
            .populate("items.product");
        
        res.json(cart);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
};

//Update item quantity
exports.updateCartItem = async (req, res) => {
    const {productId, quantity} = req.body;

    try {
        const cart = await Cart.findOne({user: req.user._id});

        const item = cart.items.find(
            (item) => item.product.toString() === productId
        );

        if (item) {
            item.quantity = quantity;
            await cart.save();
            res.json(cart);
        } else {
            res.status(404).json({message: "Item not found in cart"});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


//Remove item 
exports.removeFromCart = async (req, res) => {
    const {productId} = req.body;

    try {
        const cart = await Cart.findOne({user: req.user._id});

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId
        );

        await cart.save();

        res.json(cart);
    }catch (error) {
        res.status(500).json({message: error.message});
    }
};