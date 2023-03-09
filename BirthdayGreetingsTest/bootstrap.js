import { Friend } from "./src/models/Friend.js";

export const addData = async () => {
  try {
    Friend.create({
      last_name: "Doe",
      first_name: "John",
      date_of_birth: "2020/01/01",
      email: "Doe@gmail.com",
    });
  } catch (err) {
    console.log(err);
  }
};
