import { convertDate } from "./convertDate.js";
import { Friend } from "./models/friends.js";
import { Op } from "sequelize";

const leap = "02/29";
const twentyEighth = "02/28";

export async function fetchFriendsWithBirthday(date) {
  date = await convertDate(date); // Convert the date to the correct format

  date = date.split("/").slice(1).join("/"); // Remove the year from the date
  const friends = [];
  if (date === twentyEighth) {
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
              if (friends.length === 0) {
                console.log(`No friends found with the birthday ${date}.`);
                reject({
                  status: 404,
                  message: `No friends found with the birthday ${date}.`,
                });
              } else {
                console.log(
                  `Found ${friends.length} friend(s) with birthday(s) on ${date}`
                );
                resolve(friends);
              }
            }
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  } else if (date === leap) {
    return new Promise((resolve, reject) => {
      console.log(`No friends found with the birthday ${date}.`);
      reject({
        status: 404,
        message:
          "If a birthday falls on February 29, greetings will always be sent on February 28.",
      });
    });
  } else {
    return new Promise(async (resolve, reject) => {
      try {
        const friends = await Friend.findAll({
          where: {
            date_of_birth: {
              [Op.like]: `%/${date}`,
            },
          },
        });
        console.log(friends);
        if (friends.length === 0) {
          console.log(`No friends found with the birthday ${date}.`);
          reject({
            status: 404,
            message: `No friends found with the birthday ${date}.`,
          });
        } else {
          console.log(
            `Found ${friends.length} friend(s) with birthday(s) on ${date}`
          );
          resolve(friends);
        }
      } catch (error) {
        reject({
          status: 500,
          message: `${error.message}`,
        });
      }
    });
  }
}
