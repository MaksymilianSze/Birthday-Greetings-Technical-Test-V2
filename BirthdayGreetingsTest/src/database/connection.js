import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("birthdaygreetings", "root", "", {
  host: "localhost",
  dialect: "mysql",
});
