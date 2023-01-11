import sqlite3 from "sqlite3";
import { convertDate } from "./convertDate.js";

export function retrieveBirthdaysFromDB(date) {
  date = convertDate(date); // Convert the date to the correct format

  const db = new sqlite3.Database(
    "birthdays.db",
    sqlite3.OPEN_READONLY,
    (error) => {
      if (error) {
        console.error(
          `There was an error when trying to connect to the database: ${error}`
        );
        throw error;
      }
      console.log("Connected to the birthdays database in read mode.");
    }
  );

  date = date.split("/").slice(1).join("/"); // Remove the year from the date
  const friends = [];
  if (date === "02/28") {
    const leap = "02/29";
    return new Promise((resolve, reject) => {
      try {
        db.each(
          `SELECT last_name, first_name, date_of_birth, email FROM friends WHERE substr(date_of_birth, 6) = ? OR substr(date_of_birth, 6) = ?`, // Compare only the month and day part
          date,
          leap,
          (err, row) => {
            if (err) {
              reject(err);
            } else {
              friends.push({
                lastName: row.last_name,
                firstName: row.first_name,
                dateOfBirth: row.date_of_birth,
                email: row.email,
              });
            }
          },
          (error) => {
            if (error) {
              reject(error);
            } else {
              console.log(
                `Found ${friends.length} friend(s) with birthday(s) on ${date}`
              );
              resolve(friends);
            }
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  } else if (date === "02/29") {
    return [];
  } else {
    return new Promise((resolve, reject) => {
      let friends = [];
      try {
        db.each(
          `SELECT last_name, first_name, date_of_birth, email FROM friends WHERE substr(date_of_birth, 6) = ?`, // Compare only the month and day part
          date,
          (err, row) => {
            if (err) {
              reject(err);
            } else {
              friends.push({
                lastName: row.last_name,
                firstName: row.first_name,
                dateOfBirth: row.date_of_birth,
                email: row.email,
              });
            }
          },
          (error) => {
            if (error) {
              reject(error);
            } else {
              console.log(
                `Found ${friends.length} friend(s) with birthday(s) on ${date}`
              );
              resolve(friends);
            }
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }
}
