import mongoose from "mongoose";

mongoose

 .connect("mongodb://localhost:27017/<db_formule1>")
 .then(() => console.log("Connected"))
 .catch((err) => console.error("connection error: ", err));
