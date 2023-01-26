import express from "express";
import Song from "../models/song.model.js";
import Comment from "../models/comment.model.js";
import Favorite from "../models/favorite.model.js";
import Artist from "../models/artist.model.js";
import { Op } from "sequelize";

const router = express.Router();

router.get("/home", (req, res) => {
  Song.findAll({
    include: [Artist],
  }).then((result) => {
    if (result) {
      res.render("pages/home", { title: "JukeBox", songs: result });
    } else {
      res.render("pages/home", { title: "JukeBox" });
    }
  });
});

router.get("/song-detail/:id", (req, res) => {
  Song.findOne({
    include: [Artist],
    where: { id: req.params.id },
  }).then((result) => {
    console.log(result);
    if (result) {
      console.log("exist");
      res.render("pages/song-detail", { title: "JukeBox", songs: result });
    } else {
      res.render("pages/song-detail", { title: "JukeBox" });
    }
  });
});

router.get("/add-song", (req, res) => {
  res.render("pages/add-song", {
    title: "Add song",
    err: "",
  });
});

router.post("/add-song", (req, res) => {
  Song.findOne({
    where: {
      title: req.body.title,
    },
  }).then((searchedSongResult) => {
    if (searchedSongResult) {
      res.render("pages/add-song", {
        title: "Add song",
        err: "This song has already existed...",
      });
    } else {
      // Inset to Song and Artist Page
      // If doesn't exist the artist, it will be inserted.
      Artist.findOne({
        where: { name: { [Op.like]: `%${req.body.artist}%` } },
      }).then((searchedArtistResult) => {
        let artistId;
        if (!searchedArtistResult) {
          Artist.create({
            name: req.body.artist,
          })
            .then((createdArtistResult) => {
              console.log("Success inset to the artist table.");
              console.log(
                "createdArtistResult",
                createdArtistResult.toJSON().id
              );
              artistId = createdArtistResult.toJSON().id;
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("searchedArtistResult", searchedArtistResult.toJSON().id);
          artistId = searchedArtistResult.toJSON().id;
          console.log("artistId", artistId);
        }

        Song.create({
          title: req.body.title,
          link: req.body.youtubeUrl,
          imageUrl: req.body.imageUrl,
          genre: req.body.genre,
          recommendation: req.body.recommendationPoint,
          artistId: artistId,
        })
          .then(() => {
            console.log("Success inset to the songs table.");
          })
          .catch((err) => {
            console.log(err);
          });
      });

      res.redirect("/home");
    }
  });
});

export default router;
