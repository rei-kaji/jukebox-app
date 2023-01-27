import express from "express";
import User from "../models/user.model.js";
import Song from "../models/song.model.js";
import Comment from "../models/comment.model.js";
import Favorite from "../models/favorite.model.js";
import Artist from "../models/artist.model.js";
import { Op } from "sequelize";

const router = express.Router();

let userIdSession;
let artistId;

router.get("/home", (req, res) => {
  // Get and Check session
  userIdSession = req.session.userId;
  if (!userIdSession) {
    res.redirect("/login");
  }

  Song.findAll({
    include: [Artist],
  }).then((result) => {
    if (result) {
      res.render("pages/home", {
        title: "JukeBox",
        songs: result,
        userId: req.session.userId,
      });
    } else {
      res.render("pages/home", {
        title: "JukeBox",
        userId: req.session.userId,
      });
    }
  });
});

router.get("/song-detail/:id", async (req, res) => {
  // Get and Check session
  userIdSession = req.session.userId;
  if (!userIdSession) {
    res.redirect("/login");
  }

  // Set session
  req.session.songId = req.params.id;

  const commentsData = await Comment.findAll({
    include: [User],
    where: { songId: req.params.id },
  }).then((resolve) => {
    let returnCommentsData = resolve;
    return returnCommentsData;
  });

  Song.findOne({
    include: [Artist],
    where: { id: req.params.id },
  }).then((result) => {
    if (result) {
      res.render("pages/song-detail", {
        title: "JukeBox",
        songs: result,
        userId: userIdSession,
        comments: commentsData,
      });
    } else {
      res.render("pages/home", {
        title: "JukeBox",
      });
    }
  });
});

router.get("/add-song", (req, res) => {
  // Get and Check session
  userIdSession = req.session.userId;
  if (!userIdSession) {
    res.redirect("/login");
  }

  res.render("pages/add-song", {
    title: "Add song",
    err: "",
    userId: req.session.userId,
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
        userId: req.session.userId,
      });
    } else {
      // Inset to Song and Artist Page
      // If doesn't exist the artist, it will be inserted.
      Artist.findOne({
        where: { name: { [Op.like]: `%${req.body.artist}%` } },
      }).then((searchedArtistResult) => {
        if (!searchedArtistResult) {
          Artist.create({
            name: req.body.artist,
          })
            .then((createdArtistResult) => {
              artistId = createdArtistResult.toJSON().id;
              req.session.artistId = createdArtistResult.toJSON().id;
            })
            .then(() => {
              Song.create({
                title: req.body.title,
                link: req.body.youtubeUrl,
                imageUrl: req.body.imageUrl,
                genre: req.body.genre,
                recommendation: req.body.recommendationPoint,
                artistId: req.session.artistId,
              })
                .then(() => {
                  console.log("Success inset to the songs table.");
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          artistId = searchedArtistResult.toJSON().id;
          req.session.artistId = searchedArtistResult.toJSON().id;
        }
        Song.create({
          title: req.body.title,
          link: req.body.youtubeUrl,
          imageUrl: req.body.imageUrl,
          genre: req.body.genre,
          recommendation: req.body.recommendationPoint,
          artistId: req.session.artistId,
        })
          .then(() => {
            console.log("Success inset to the songs table.");
          })
          .catch((err) => {
            console.log(err);
          });

        res.redirect("/home");
      });
    }
  });
});

router.post("/add-comment/:id", (req, res) => {
  // Get and Check session
  userIdSession = req.session.userId;
  if (!userIdSession) {
    res.redirect("/login");
  }
  let songIdSession = req.session.songId;

  // Create Comment

  Comment.create({
    comment: req.body.comment,
    songId: songIdSession,
    userId: userIdSession,
  })
    .then(() => {
      console.log("Success inset to the comments table.");
    })
    .catch((err) => {
      console.log(err);
    });

  // Find or Create Favorite
  if (req.body.favorite) {
    Favorite.findOrCreate({
      where: { userId: userIdSession, songId: songIdSession },
      defaults: {},
    })
      .then(() => {
        console.log("Success inset to the favorites table.");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  res.redirect("/home");
});

router.get("/favorites", (req, res) => {
  userIdSession = req.session.userId;
  if (!userIdSession) {
    res.redirect("/login");
  }

  Favorite.findAll({ include: [Song], where: { userId: userIdSession } }).then(
    (favorites) => {
      res.render(`pages/favorites`, {
        title: "JukeBox",
        favorites: favorites,
      });
    }
  );
});

router.get("/delete-favorite/:id", (req, res) => {
  userIdSession = req.session.userId;
  if (!userIdSession) {
    res.redirect("/login");
  }
  Favorite.destroy({
    where: { userId: userIdSession, songId: req.params.id },
  }).then(() => {
    res.redirect("/favorites");
  });
});

router.get("/update-song/:id", async (req, res) => {
  // Get and Check session
  userIdSession = req.session.userId;
  if (!userIdSession) {
    res.redirect("/login");
  }

  // Set session
  req.session.songId = req.params.id;

  Song.findOne({
    include: [Artist],
    where: { id: req.session.songId },
  }).then((result) => {
    if (result) {
      res.render("pages/update-song", {
        title: "JukeBox",
        song: result,
        userId: userIdSession,
      });
    } else {
      res.redirect("/home");
    }
  });
});

router.post("/update-song/:id", (req, res) => {
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
          artistId = createdArtistResult.toJSON().id;
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      artistId = searchedArtistResult.toJSON().id;
    }
    Song.findOne({
      where: {
        title: req.body.title,
      },
    }).then((searchedSongResult) => {
      if (searchedSongResult) {
        Song.update(
          {
            title: req.body.title,
            link: req.body.youtubeUrl,
            imageUrl: req.body.imageUrl,
            genre: req.body.genre,
            recommendation: req.body.recommendationPoint,
            artistId: artistId,
          },
          { where: { artistId: artistId, title: req.body.title } }
        )
          .then(() => {
            console.log("Success inset to the songs table.");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  });

  res.redirect("/home");
});

export default router;
