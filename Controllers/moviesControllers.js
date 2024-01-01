const mongoose = require("mongoose")
const Movie = require('../Models/movieModel')

exports.getAllMovies = async (req,res)=>{
    try {
        const movies = await Movie.find()
        res.status(200).json({
            status:"success",
            length:movies.length,
            data:{
                movies
            }
        })
    } catch (error) {
        res.status(404).json({
            status:"fail",
            message:error.message
        })
    }
}
exports.createMovie = async (req,res)=>{
    try {
        const movie = await Movie.create(req.body)
        res.status(201).json({
            status:"success",
            data:{
                movie
            }
        })

    } catch (error) {
        res.status(400).json({
            status:"fail",
            message:error.message
        })
    }


}

exports.getMovie =async (req,res)=>{
    try {
        // const movie = await Movie.find({_id:req.params.id})
        const movie = await Movie.findById(req.params.id)
        
        res.status(200).json({
            status:"success",
            data:{
                movie
            }
        })
    } catch (error) {
        res.status(404).json({
            status:"fail",
            message:error.message
        })
    }
}
exports.updateMovie =async (req,res)=>{
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        res.status(200).json({
            status:"success",
            data:{
                movie:updatedMovie
            }
        }
        )
    } catch (error) {
        res.status(404).json({
            status:"fail",
            message:error.message
        })
    }


}
exports.deleteMovie = async (req,res)=>{
    try {
        await Movie.findByIdAndDelete(req.params.id,)
        res.status(204).json({
            status:"success",
            data:null
        })
    } catch (error) {
        res.status(404).json({
            status:"fail",
            message:error.message
        })
    }

}
