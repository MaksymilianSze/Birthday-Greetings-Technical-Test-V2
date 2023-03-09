import { convertDate } from "./convertDate.js";
import { Friend } from "../../src/models/Friend.js";
import { Op } from "sequelize";
import { Sequelize } from "sequelize";
import logger from "./logger.js";

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
      logger.error(error);
      reject({
        status: 400,
        message: error.message,
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

  return new Promise(async (resolve, reject) => {
    try {
      const friends = await Friend.findAll({
        where: {
          date_of_birth: {
            [Op.and]: [
              Sequelize.where(
                Sequelize.fn(
                  "DATE_FORMAT",
                  Sequelize.col("date_of_birth"),
                  "%m/%d"
                ),
                {
                  [Op.between]: [startDate, endDate],
                }
              ),
            ],
          },
        },
      });
      if (!friends.length) {
        logger.info(
          `No friends with birthdays between ${startDate} and ${endDate}`
        );
        reject({
          status: 404,
          message: "No friends with birthdays between the specified dates",
        });
      } else {
        logger.info(
          `Retrieved ${friends.length} friend(s) with birthday(s) between ${startDate} and ${endDate}`
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
