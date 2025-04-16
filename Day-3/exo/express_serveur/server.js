import express from "express";
import connectDB from "./db/connectDB.js";
import authRoutes from "./routs/auth.js";

// connect db
connectDB();

// init express
const app = express();


app.use("/api/v1/", authRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
console.log('Server running on port $ {port}');

});
