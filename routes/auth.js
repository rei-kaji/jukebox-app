import express from "express";
import User from "../models/user.model.js";

const router = express.Router();

router.get("/", (req, res) => {
  if (req.session) {
    res.redirect("/home");
  }
  res.render("pages/login", {
    title: "Home Page",
    message: "",
  });
});

router.get("/login", (req, res) => {
  res.render("pages/login", { title: "Login", message: "" });
});

router.get("/register", (req, res) => {
  res.render("pages/register", { title: "Register" });
});

router.post("/login", (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
      password: req.body.password,
    },
  })
    .then((user) => {
      // user is data from mysql database
      // when user is not found
      if (!user)
        res.render("pages/login", {
          message: "Invalid email or password",
          title: "Login",
        });
      let userId = user.toJSON().id;
      req.session.userId = userId;

      console.log(req.session.userId);
      res.redirect("/home");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/register", (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      // if user already exists in db, then we will render login page with error message
      if (user)
        res.render("pages/login", {
          message: "email address already taken!",
          title: "Login",
        });
      else {
        // if user does not exists in db, then we will create new user
        User.create({
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
        })
          .then((user) => {
            if (user)
              res.render("pages/login", {
                message: "Registration Successfull",
                title: "Login",
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/logout", (req, res) => {
  req.session.destroy();

  res.redirect("/");
});

export default router;
