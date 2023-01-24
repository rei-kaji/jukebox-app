import sequelize from "../routes/sequelize";
import { DataTypes } from "sequelize";

const Genre = sequelize.define("genres", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

sequelize
  .sync()
  .then(() => {
    // sync() creates table if it doesn't exist
    console.log("Genre table created successfully");
  })
  .catch((err) => {
    console.log("Unable to create table: ", err);
  });

export default Genre;
