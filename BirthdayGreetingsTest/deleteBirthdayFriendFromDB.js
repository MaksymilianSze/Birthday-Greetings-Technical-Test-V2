import sqlite3 from "sqlite3";

export function deleteBirthdayFriendFromDB(email) {
  if (!email) {
    throw new Error("Missing required field: email");
  }

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
      db.run(`DELETE FROM friends WHERE email = ?`, [email], (error) => {
        if (error) {
          reject(error);
        }
        console.log(
          `Friend with email: ${email} successfully deleted from the database.`
        );
        resolve("Friend successfully deleted from the database.");
      });
    } catch (error) {
      reject(error);
    }
  });
}
