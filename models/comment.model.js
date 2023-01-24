import sequelize from "../routes/sequelize";
import { DataTypes } from "sequelize";

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
  song_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: "songs",
    referencesKey: "id",
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: "users",
    referencesKey: "id",
  },
});

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
