const express = require("express")
const {getAllMovies,createMovie,getMovie,updateMovie,deleteMovie,checkID,validateBody} = require("../Controllers/moviesControllers")

const moviesRouter = express.Router();


// moviesRouter.param("id",checkID)

moviesRouter.route("/")
    .get(getAllMovies)
    .post(createMovie)

moviesRouter.route("/:id")
    .get(getMovie)
    .patch(updateMovie)
    .delete(deleteMovie)

module.exports = moviesRouter;