const express = require("express")
const fs = require("fs")

const app = express()
const movies = JSON.parse(fs.readFileSync("./data/movies.json"))


app.use(express.json())
app.get("/api/v1/movies",(req,res)=>{
    res.status(200).json({
        "status":"success",
        "count":movies.length,
        "data":{"movies":movies}
    })
})

app.post("/api/v1/movies",(req,res)=>{

    const movieId = parseInt(movies[movies.length-1].id) + 1    
    const movie = Object.assign({id:movieId},req.body)
    movies.push(movie)
    console.log(movies);

    fs.writeFile("./data/movies.json",JSON.stringify(movies),(err)=>{
        res.status(201).json(
            {
                status:"success",
                data:{
                    movies:movie
                }
            }
        )
    })
    // res.status(200).json("ok")/
})

app.get("/api/v1/movies/:id?",(req,res)=>{

    const id = req.params.id *1
    const movie = movies.find(mov=>mov.id == id)
    if(!movie){
       return res.status(404).json({
            status:"fail",
            message:"movie id "+id+" donsn't exit"
        })
    }

    res.status(200).json({"status":"suuccess",data:{
        movie:movie
    }})
})

app.patch("/api/v1/movies/:id",(req,res)=>{
    const id = req.params.id *1
    const movie = movies.find(mov=>mov.id==id)
    if(!movie){
       return res.status(404).json({
            status:"fail",
            message:"movie id "+id+" donsn't exit"
        })        
    }

    const index = movies.indexOf(movie)
    const updatedMovie = Object.assign(movie,req.body)
    movies[index] = updatedMovie

    fs.writeFile("./data/movies.json",JSON.stringify(movies),(err)=>{
        res.status(200).json({
            status:"succes",
            data:{
                movie:updatedMovie
            }
        })
    })

})

app.delete("/api/v1/movies/:id",(req,res)=>{
    const id = req.params.id * 1
    const movie = movies.find(mov=>mov.id==id)

    if(!movie){
       return res.status(404).json({
            status:"fail",
            message:"movie id "+id+" donsn't exit"
        })        
    }
    const index = movies.indexOf(movie)

    movies.splice(index,1)

    fs.writeFile("./data/movies.json",JSON.stringify(movies),(err)=>{
        res.status(200).json({
            status:"succes",
            data:{
                movie:null
            }
        })
    })
})

app.post("/",(req,res)=>{
    res.status(200).json("hi")
})
const port  = 3000
app.listen(port,()=>{
    console.log("server running on port "+ port);
})

