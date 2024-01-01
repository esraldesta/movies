const express = require("express")
const morgan = require("morgan")
const app = express()
const moviesRouter = require("./Routes/moviesRoutes")

app.use(express.json())
app.use(morgan("dev"))
app.use(express.static("./public"))
app.use("/api/v1/movies",moviesRouter)

app.post("/",(req,res)=>{
    res.status(200).json("hi")
})

const port  = 3000
app.listen(port,()=>{
    console.log("server running on port "+ port);
})

