const fs = require("fs")

const movies = JSON.parse(fs.readFileSync("./data/movies.json"))

exports.getAllMovies = (req,res)=>{
    res.status(200).json({
        "status":"success",
        "count":movies.length,
        "data":{"movies":movies}
    })
}
exports.createMovie = (req,res)=>{

    const movieId = parseInt(movies[movies.length-1].id) + 1    
    const movie = Object.assign({id:movieId},req.body)
    movies.push(movie)

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
}
exports.getMovie = (req,res)=>{
    const id = req.params.id
    const movie = movies.find(mov=>mov.id == id)
    res.status(200).json({"status":"suuccess",data:{
        movie:movie
    }})
}
exports.updateMovie = (req,res)=>{
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

}
exports.deleteMovie = (req,res)=>{
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
}

exports.checkID = (req,res,next,value)=>{
    const id = value *1
    const movie = movies.find(mov=>mov.id == id)
    if(!movie){
       return res.status(404).json({
            status:"fail",
            message:"movie id "+id+" donsn't exit"
        })
    }
    next()
}

exports.validateBody = (req,res,next)=>{
    if(!req.body.name || !req.body.releaseYear){
        return res.status(400).json(
            {
                status:"fail",
                message:"Not a valid data"
            }
        )
    }
    next()
}