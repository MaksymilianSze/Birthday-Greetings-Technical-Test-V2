import Sequelize from "sequelize";

const sequelize = new Sequelize("friends", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export const Friend = sequelize.define(
  "friend",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
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
  },
  {
    timestamps: false,
  }
);

sequelize
  .sync()
  .then(() => console.log("table created"))
  .catch((err) => console.error("Error creating table: ", err));
