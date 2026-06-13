import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDb.js";
import userRouter from "./routes/user.js";
import pickupRouter from "./routes/pickup.js";
dotenv.config();


const app = express();


app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});


app.use(express.json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/pickups", pickupRouter);

connectDB().then(() => {
    app.listen(3000, () => {
        console.log("Live at port http://localhost:3000")
    })
}).catch((err) => {
    console.log(`error while connecting the db and server failed. ${err}`)
})
