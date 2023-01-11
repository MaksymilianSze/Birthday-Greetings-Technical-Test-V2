import { readFileSync } from "fs";

const dateFormat = /^\d{4}\/\d{2}\/\d{2}$/;

export function retrieveBirthdaysFromCSV(date) {
  if (!dateFormat.test(date)) {
    throw new Error(
      `Invalid date format. Expected "yyyy/mm/dd", but got ${date}`
    );
  }

  try {
    const birthdayFriends = readFileSync("birthdays.csv", "utf8")
      .split("\n")
      .slice(1)
      .map((row) => {
        const [lastName, firstName, dateOfBirth, email] = row
          .split(",")
          .map((s) => s.trim()); // Parse the csv and store it as an array of objects and remove the whites spaces with trim()
        return { lastName, firstName, dateOfBirth, email };
      });

    date = date.split("/").slice(1).join("/"); // Remove the year from the date

    console.log("Opened CSV successfully");

    let filteredBirthdayFriends;

    if (date === "02/28") {
      // Check if today is Feb 28th and if it is, check if any of the friends have a birthday on Feb 29th
      filteredBirthdayFriends = birthdayFriends.filter((friend) => {
        if (!dateFormat.test(friend.dateOfBirth)) {
          throw new Error(
            `Invalid date format in CSV. Expected "yyyy/mm/dd", but got ${friend.dateOfBirth}`
          );
        }
        return (
          friend.dateOfBirth.split("/").slice(1).join("/") === "02/29" ||
          friend.dateOfBirth.split("/").slice(1).join("/") === "02/28"
        );
      });
    } else if (date === "02/29") {
      filteredBirthdayFriends = []; // If today is Feb 29th we don't want to send any greetings because then we would be sending a birthday greeting twice
    } else {
      filteredBirthdayFriends = birthdayFriends.filter(
        (friend) => friend.dateOfBirth.split("/").slice(1).join("/") === date
      );
    }
    console.log(
      `Found ${filteredBirthdayFriends.length} friend(s) with birthday(s) on ${date}`
    );
    return filteredBirthdayFriends;
  } catch (error) {
    console.error(
      `There was an error when trying to retrieve the birthdays from the CSV file, does the file exist?: ${error}`
    );
    throw error;
  }
}
