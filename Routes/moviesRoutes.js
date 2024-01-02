const express = require("express")
const {getAllMovies,createMovie,getMovie,updateMovie,deleteMovie,getMovieStats,getHighestRated,getMovieByGenre} = require("../Controllers/moviesControllers")

const moviesRouter = express.Router();


// moviesRouter.param("id",checkID)
moviesRouter.route('/movie-stats').get(getMovieStats);
moviesRouter.route('/highest-rated').get(getHighestRated, getAllMovies)
moviesRouter.route('/movies-by-genre/:genre').get(getMovieByGenre);

moviesRouter.route("/")
.get(getAllMovies)
.post(createMovie)

moviesRouter.route("/:id")
.get(getMovie)
.patch(updateMovie)
.delete(deleteMovie)


module.exports = moviesRouter;