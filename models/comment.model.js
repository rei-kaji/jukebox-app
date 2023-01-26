import sequelize from "./sequelize.js";
import { DataTypes } from "sequelize";
import Song from "../models/song.model.js";
import User from "../models/user.model.js";

const Comment = sequelize.define("comments", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Comment.belongsTo(Song, { foreignKey: { allowNull: false } });
Comment.belongsTo(User, { foreignKey: { allowNull: false } });

sequelize
  .sync()
  .then(() => {
    // sync() creates table if it doesn't exist
    console.log("Comment table created successfully");
  })
  .catch((err) => {
    console.log("Unable to create table: ", err);
  });

export default Comment;
