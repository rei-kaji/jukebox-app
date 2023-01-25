import express from "express";
import Song from "../models/song.model.js";
// import Comment from "../models/comment.model.js";
// import Favorite from "../models/favorite.model.js";
// import Genre from "../models/genre.model.js";

const router = express.Router();

router.get("/home", (req, res) => {
  //   Song.findAll()
  //     .then((users) => {
  //       res.render("pages/home", { users: users, title: "JukeBox" });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  res.render("pages/home", { title: "JukeBox" });
});

export default router;
