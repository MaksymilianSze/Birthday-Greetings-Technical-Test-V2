import sqlite3 from "sqlite3";
import { convertDate } from "./convertDate.js";

export async function addNewBirthdayFriendToDB(
  lastName,
  firstName,
  dateOfBirth,
  email
) {
  try {
    // Validate the input
    if (!lastName || !firstName || !email || !dateOfBirth) {
      throw new Error("Missing required fields");
    }

    if (!/^[a-zA-Z]+$/.test(lastName) || !/^[a-zA-Z]+$/.test(firstName)) {
      throw new Error("Name fields should only contain letters");
    } else if (lastName.length > 20 || firstName.length > 20) {
      throw new Error("Name fields should not be longer than 20 characters");
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      throw new Error("Invalid email address");
    }
    console.log("Inputs validated");
  } catch (error) {
    return new Promise((resolve, reject) => {
      console.log(`Bad input: ${error.message}.`);
      reject({
        status: 400,
        message: `Bad input: ${error.message}.`,
      });
    });
  }

  dateOfBirth = await convertDate(dateOfBirth); // Convert the date to the correct format

  const db = new sqlite3.Database(
    "birthdays.db",
    sqlite3.OPEN_READWRITE,
    (error) => {
      if (error) {
        console.error(
          `There was an error when trying to connect to the database: ${error}`
        );
        throw error;
      }
      console.log("Connected to the birthdays database in write mode.");
    }
  );

  return new Promise((resolve, reject) => {
    try {
      db.get(
        `SELECT * FROM friends WHERE email = ?`,
        [email],
        (error, friend) => {
          if (error) {
            reject(error);
          }
          if (friend) {
            console.log(`A friend with email ${email} already exists`);
            reject({
              status: 409,
              message: `A friend with email ${email} already exists in the database`,
            });
          } else {
            db.run(
              `INSERT INTO friends (last_name, first_name, date_of_birth, email) VALUES (?, ?, ?, ?)`,
              [lastName, firstName, dateOfBirth, email],
              (error) => {
                if (error) {
                  reject(error);
                }
                console.log(
                  `A row has been inserted with values: ${lastName}, ${firstName}, ${dateOfBirth}, ${email}`
                );
                resolve("Friend successfully added to the database.");
              }
            );
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}
