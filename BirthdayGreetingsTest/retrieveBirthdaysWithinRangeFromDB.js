import sqlite3 from "sqlite3";
import { convertDate } from "./convertDate.js";

const twentyEighth = "28";
const feb = "02";

export async function retrieveBirthdaysWithinRangeFromDB(startDate, endDate) {
  try {
    // Validate the input
    if (!startDate || !endDate) {
      throw new Error("Missing required fields");
    }
  } catch (error) {
    return new Promise((resolve, reject) => {
      console.log(error);
      reject({
        status: 400,
        message: error,
      });
    });
  }

  // Convert the date to the correct format
  startDate = await convertDate(startDate);
  endDate = await convertDate(endDate);

  // Remove the year from the date
  startDate = startDate.split("/").slice(1).join("/");
  endDate = endDate.split("/").slice(1).join("/");

  // If the end date is 02/28, change it to 02/29 because greetings for 29th are always sent on 28th
  endDate = endDate.split("/");
  if (endDate[0] === feb && endDate[1] === twentyEighth) {
    endDate[1] = "feb";
  }
  endDate = endDate.join("/");

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
          } else {
            if (!rows.length) {
              console.log(
                `No friends with birthdays between ${startDate} and ${endDate}`
              );
              reject({
                status: 404,
                message:
                  "No friends with birthdays between the specified dates",
              });
            } else {
              console.log(
                `Retrieved ${rows.length} friend(s) with birthday(s) between ${startDate} and ${endDate}`
              );
              resolve(rows);
            }
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}
