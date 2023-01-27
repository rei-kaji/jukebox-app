import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRouter from "./routes/auth.js";
import jukeboxRouter from "./routes/jukebox.js";
import session from "express-session";
// import MySQLStore from "express-mysql-session";
// import dotenv from "dotenv";

// dotenv.config();
// const options = {
//   host: process.env.HOST,
//   port: 3001,
//   user: process.env.DATABASE_USERNAME,
//   password: process.env.DATABASE_PASSWORD,
//   database: process.env.DATABASE_NAME,
// };

const app = express();
// const sessionStore = new MySQLStore(options);

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(
  session({
    secret: "jukeboxKey", // a secret key to sign the session ID cookie
    resave: false, // don’t save session if unmodified
    saveUninitialized: true, // always create a new session
    // store: sessionStore,
  })
);

app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

app.use("/", authRouter);

app.use("/", jukeboxRouter);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
