import Sequelize from "sequelize";
import { sequelize } from "../database/connection.js";

export const Friend = sequelize.define("friend", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  last_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  first_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  date_of_birth: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

sequelize
  .sync()
  .then(() => console.log("table created"))
  .catch((err) => console.error("Error creating table: ", err));
