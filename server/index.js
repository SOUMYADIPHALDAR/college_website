import express from "express";
import dotenv from "dotenv";
import connectDb from "./src/config/db.js";

const app = express();
dotenv.config();
const port = process.env.PORT;

connectDb()
.then(() => {
    app.listen(port, () => {
        console.log(`Server is listening at http://localhost:${port}`);
    })
})
.catch((error) => {
    console.log("Mongodb connection lost..", error.message);
});