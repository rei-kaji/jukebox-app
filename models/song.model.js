import sequelize from "./sequelize.js";
import { DataTypes } from "sequelize";

const Song = sequelize.define("songs", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  genre: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: "genres",
    referencesKey: "id",
  },
  link: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

sequelize
  .sync()
  .then(() => {
    // sync() creates table if it doesn't exist
    console.log("Song table created successfully");
  })
  .catch((err) => {
    console.log("Unable to create table: ", err);
  });

export default Song;
