import sequelize from "./sequelize.js";
import { DataTypes } from "sequelize";
import Song from "../models/song.model.js";
import User from "../models/user.model.js";

const Favorite = sequelize.define("favorites", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
});

Favorite.belongsTo(Song, { foreignKey: { allowNull: false } });
Favorite.belongsTo(User, {
  foreignKey: { allowNull: false },
});

sequelize
  .sync()
  .then(() => {
    // sync() creates table if it doesn't exist
    console.log("Favorite table created successfully");
  })
  .catch((err) => {
    console.log("Unable to create table: ", err);
  });

export default Favorite;
