require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT;

//Routes
const connectDb = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

connectDb();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);




//Test Route
app.get('/', (req, res) => {
    res.send("Server is running");
});

app.listen(PORT, ()=> {
    console.log(`Server runing on Port ${PORT}`);
});