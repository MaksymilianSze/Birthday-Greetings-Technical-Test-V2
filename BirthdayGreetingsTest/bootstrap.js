import { Friend } from "./src/models/Friend.js";
import logger from "./src/utils/logger.js";

export const addData = async () => {
  try {
    await Friend.create({
      last_name: "Doe",
      first_name: "John",
      date_of_birth: "2020/01/01",
      email: "Doe@gmail.com",
    });
  } catch (err) {
    logger.error(err);
  }
};
