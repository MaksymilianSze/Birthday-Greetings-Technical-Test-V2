import { Friend } from "./src/models/Friend.js";

export async function insertData() {
  const friends = [
    {
      lastName: "Doe",
      firstName: "John",
      dateOfBirth: "1982/10/08",
      email: "doe@gmail.com",
    },
    {
      lastName: "Smith",
      firstName: "Kenny",
      dateOfBirth: "1985/02/28",
      email: "KennyS@gmail.com",
    },
  ];
  try {
    await Friend.create(friends);
  } catch (error) {
    console.log(error);
  }
}
