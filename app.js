const express = require("express")
const morgan = require("morgan")
const mongoose = require("mongoose")
const dotenv =  require("dotenv")

dotenv.config({path:"./config.env"})

const app = express()
const moviesRouter = require("./Routes/moviesRoutes")

app.use(express.json())
if(process.env.NODE_ENV == "devlopment"){
    app.use(morgan("dev"))
}
app.use(express.static("./public"))
app.use("/api/v1/movies",moviesRouter)

app.post("/",(req,res)=>{
    res.status(200).json("hi")
})

mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser:true}).then(conn=>{
    console.log("DB connected");
}).catch(err=>{
    console.error("DB not connected");
})




const port  = process.env.PORT || 3000
app.listen(port,()=>{
    console.log("server running on port "+ port);
})