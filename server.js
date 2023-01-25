import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRouter from "./routes/auth.js";
import jukeboxRouter from "./routes/jukebox.js";

const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.set("view engine", "ejs");

app.use("/", authRouter);

app.use("/", jukeboxRouter);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
