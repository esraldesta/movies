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

const movieSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required field"],
        unique:true},
        
    description:String,
    duration:{
        type:Number,
        required:[true,"Duration is required field"]},
    ratings:{
        type:Number,
        default:1.0}
})


const Movie =mongoose.model("Movie",movieSchema)

const testMovie =  new Movie({
    name:"movie one",
    description:"this is just for testign purpose",
    duration:20,
    ratings:4
})

// testMovie.save().then(newdoc=>{
//     console.log(newdoc);
// }).catch(err=>{
//     console.log(err);
// })

const port  = process.env.PORT || 3000
app.listen(port,()=>{
    console.log("server running on port "+ port);
})