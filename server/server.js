import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/connectDb.js";
import userRouter from "./routes/user.js";
import pickupRouter from "./routes/pickup.js";
import inspectorRouter from "./routes/inspector.js";
dotenv.config();


const app = express();


app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
}));


app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});


app.use(express.json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/pickups", pickupRouter);
app.use("/api/v1/inspectors", inspectorRouter);

connectDB().then(() => {
    app.listen(3000, () => {
        console.log("Live at port http://localhost:3000")
    })
}).catch((err) => {
    console.log(`error while connecting the db and server failed. ${err}`)
})
