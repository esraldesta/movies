const express = require("express")
const morgan = require("morgan")
const mongoose = require("mongoose")
const dotenv =  require("dotenv")
const CustomError  = require("./utils/CustomError")
const globalErrorHandler =  require("./Controllers/errorController")
dotenv.config({path:"./config.env"})

process.on("uncaughtException",(err)=>{
    console.log(err.name,err.message);
    console.log("Uncaught Exception Occured! Shuting down the server");
    // crusing the sever is not optional here it is must B/c it is in a state called uncleand state
    process.exit(1)

})

const app = express()
const moviesRouter = require("./Routes/moviesRoutes")

app.use(express.json())
if(process.env.NODE_ENV == "devlopment"){
    app.use(morgan("dev"))
}
app.use(express.static("./public"))
app.use("/api/v1/movies",moviesRouter)

app.all("*",(req,res,next)=>{
    // res.status(404).json({
    //     status:"fail",
    //     message:`Can't find the url ${req.originalUrl} on the server`
    // })

    // const err = new Error(`Can't find the url ${req.originalUrl} on the server`)
    // err.statusCode = 404
    // err.status = "fail"
    // next(err)  // if parametes is passed it means error has accored

    const err = new CustomError(`Can't find the url ${req.originalUrl} on the server`,404)
    next(err)
})

app.use(globalErrorHandler)

mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser:true}).then(conn=>{
    console.log("DB connected");
})
.catch(err=>{
    console.error("DB not connected");
})




const port  = process.env.PORT || 3000
const server = app.listen(port,()=>{
    console.log("server running on port "+ port);
})

process.on("unhandledRejection",(err)=>{
    console.log(err.name,err.message);
    console.log("Unhandled Rejection Occured! Shuting down the server");
    // crusing the sever is optional here
    server.close(()=>{
        process.exit(1)
    })
})


// console.log(x);