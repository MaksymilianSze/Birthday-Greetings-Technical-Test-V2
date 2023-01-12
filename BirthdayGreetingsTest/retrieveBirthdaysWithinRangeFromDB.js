import sqlite3 from "sqlite3";
import { convertDate } from "./convertDate.js";

export function retrieveBirthdaysWithinRangeFromDB(startDate, endDate) {
  // Validate the input
  if (!startDate || !endDate) {
    throw new Error("Missing required fields");
  }

  // Convert the date to the correct format
  startDate = convertDate(startDate);
  endDate = convertDate(endDate);

  // Remove the year from the date
  startDate = startDate.split("/").slice(1).join("/");
  endDate = endDate.split("/").slice(1).join("/");

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

  return new Promise((resolve, reject) => {
    try {
      db.all(
        `SELECT * FROM friends WHERE substr(date_of_birth, 6) BETWEEN ? AND ?`,
        [startDate, endDate],
        (error, rows) => {
          if (error) {
            reject(error);
          }
          if (!rows.length) {
            console.log(
              `No friends with birthdays between ${startDate} and ${endDate}`
            );
            reject("No friends with birthdays between the specified dates");
          }

          console.log(
            `Retrieved ${rows.length} friend(s) with birthday(s) between ${startDate} and ${endDate}`
          );
          resolve(rows);
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}
