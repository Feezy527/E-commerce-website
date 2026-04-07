const Product = require("../models/Product");

//Create Product

exports.createProduct = async (req, res) => {
    try {
        const {title, price, description, image, countInStock} = req.body;

        const product = new Product({
            title, price, description, image, countInStock,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);

        } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

//Get single product
exports.getProductById = async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({message: "Product not found"});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};