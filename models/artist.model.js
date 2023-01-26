import sequelize from "./sequelize.js";
import { DataTypes } from "sequelize";

const Artist = sequelize.define("artists", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

sequelize
  .sync()
  .then(() => {
    // sync() creates table if it doesn't exist
    console.log("Artist table created successfully");
  })
  .catch((err) => {
    console.log("Unable to create table: ", err);
  });

export default Artist;
