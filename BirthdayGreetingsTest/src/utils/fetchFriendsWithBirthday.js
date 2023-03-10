import { convertDate } from "./convertDate.js";
import { Friend } from "../../src/models/Friend.js";
import { Op } from "sequelize";
import logger from "./logger.js";

const leap = "02/29";
const twentyEighth = "02/28";

export async function fetchFriendsWithBirthday(date) {
  date = await convertDate(date); // Convert the date to the correct format

  date = date.split("/").slice(1).join("/"); // Remove the year from the date
  if (date === twentyEighth) {
    return new Promise(async (resolve, reject) => {
      try {
        const friends = await Friend.findAll({
          where: {
            date_of_birth: {
              [Op.or]: [
                { [Op.like]: `%/${leap}` },
                { [Op.like]: `%/${twentyEighth}` },
              ],
            },
          },
        });
        if (friends.length === 0) {
          logger.error(`No friends found with the birthday ${date}.`);
          reject({
            status: 404,
            message: `No friends found with the birthday ${date}.`,
          });
        } else {
          logger.info(
            `Found ${friends.length} friend(s) with birthday(s) on ${date}`
          );
          resolve(friends);
        }
      } catch (err) {
        reject(err);
      }
    });
  } else if (date === leap) {
    return new Promise((resolve, reject) => {
      logger.info(`No friends found with the birthday ${date}.`);
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
        if (friends.length === 0) {
          logger.error(`No friends found with the birthday ${date}.`);
          reject({
            status: 404,
            message: `No friends found with the birthday ${date}.`,
          });
        } else {
          logger.info(
            `Found ${friends.length} friend(s) with birthday(s) on ${date}`
          );
          resolve(friends);
        }
      } catch (error) {
        logger.error(error);
        reject({
          status: 500,
          message: `${error.message}`,
        });
      }
    });
  }
}
