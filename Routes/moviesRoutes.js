const express = require("express")
const {getAllMovies,createMovie,getMovie,updateMovie,deleteMovie,getMovieStats,getHighestRated,getMovieByGenre} = require("../Controllers/moviesControllers");
const { protect,restrict } = require("../Controllers/authControllers");

const moviesRouter = express.Router();


// moviesRouter.param("id",checkID)
moviesRouter.route('/movie-stats').get(getMovieStats);
moviesRouter.route('/highest-rated').get(getHighestRated, getAllMovies)
moviesRouter.route('/movies-by-genre/:genre').get(getMovieByGenre);

moviesRouter.route("/")
.get(protect ,getAllMovies)
.post(createMovie)

moviesRouter.route("/:id")
.get(protect ,getMovie)
.patch(updateMovie)
.delete(protect,restrict("admin"), deleteMovie)


module.exports = moviesRouter;