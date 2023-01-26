import sequelize from "./sequelize.js";
import { DataTypes } from "sequelize";
import Artist from "../models/artist.model.js";

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
  recommendation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false,
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

Song.belongsTo(Artist, { foreignKey: { allowNull: false } });

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
