import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE_NAME, // Database name
  process.env.DATABASE_USERNAME, // Database Username
  process.env.DATABASE_PASSWORD, // Database Password
  {
    host: process.env.HOST, // Database Host
    dialect: process.env.DIALECT, // Database Type
  }
);
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has ben established successfully");
  })
  .catch((err) => {
    console.error("Unable to connect to the database: ", err);
  });

export default sequelize;
