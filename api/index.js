import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoute from "./routes/auth.js"
import userRoute from "./routes/users.js"
import hotelRoute from "./routes/hotels.js"
import roomRoute from "./routes/rooms.js"
import cookieParser from "cookie-parser"

const app = express()
const port = 8800
dotenv.config()

async function main() {
  await mongoose.connect(process.env.MONGO);
  console.log("Connected to mongoDB")
}

// app.get("/", (req,res) => {
//     res.send("hello first request!")
// })

// middlewares
app.use(cookieParser())

app.use(express.json())

app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/hotels", hotelRoute)
app.use("/api/rooms", roomRoute)

app.use((err,req,res,next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!"
  return res.status(errorStatus).json({
    success: false,
    status : errorStatus,
    message: errorMessage,
    stack: err.stack
  })
})

app.listen(port, () => {
    main().catch(err => console.log(err));
    console.log(`Connected to port ${port}`)
})