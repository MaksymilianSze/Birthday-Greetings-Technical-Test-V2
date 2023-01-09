import { readFileSync } from "fs";
import sqlite3 from "sqlite3";
const db = new sqlite3.Database("birthdays.db");

function useEmailService(email, subject, body) {
  // TODO: Send email using email service
}

function useSMSService(phoneNumber, body) {
  // TODO: Send sms using sms service
}

function sendGreeting(birthdayFriends, service) {
  const subject = "Happy birthday!";
  for (const friend of birthdayFriends) {
    // Loop through the array of friends with a birthday and send an email to each friend
    const body = `Happy birthday, dear ${friend.firstName}!`;
    if (service === "email") {
      useEmailService(friend.email, subject, body);
      console.log(
        `Sending email to ${friend.email} with subject: ${subject} and body: ${body}`
      );
    } else if (service === "sms") {
      useSMSService(friend.phoneNumber, body);
      console.log(`Sending sms to ${friend.phoneNumber} with body: ${body}`); // The data provided doesn't have phone numbers but if it did it would be part of the friend object so for now it will be undefined
    }
  }
}

function getTodaysFormattedDate() {
  const today = new Date();
  return `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`; // Format the date so that it matches the format used in the csv and return it
}

function getBirthdayFriends(friends) {
  const today = getTodaysFormattedDate();
  if (today.split("/").slice(1).join("/") === "02/28") {
    // Check if today is Feb 28th and if it is, check if any of the friends have a birthday on Feb 29th
    return friends.filter((friend) => {
      if (friend.dateOfBirth.split("/").slice(1).join("/") === "02/29") {
        return friend;
      }
      return friend.dateOfBirth === today;
    });
  } else if (today.split("/").slice(1).join("/") === "02/29") {
    // If today is Feb 29th we don't want to send any greetings because then we would be sending a birthday greeting twice
    return [];
  }
  return friends.filter((friend) => friend.dateOfBirth === today); // Filter the array of friends and return only the friends with a birthday today
}

function checkLeapDay(friends, birthday) {
  if (birthday.split("/").slice(1).join("/") === "02/28") {
    // Check if today is Feb 28th and if it is, check if any of the friends have a birthday on Feb 29th
    return friends.filter((friend) => {
      if (friend.dateOfBirth.split("/").slice(1).join("/") === "02/29") {
        return friend;
      }
      return friend.dateOfBirth === birthday;
    });
  } else if (birthday.split("/").slice(1).join("/") === "02/29") {
    // If today is Feb 29th we don't want to send any greetings because then we would be sending a birthday greeting twice
    return [];
  }
  return friends;
}

function retrieveAllBirthdaysFromCSV() {
  return readFileSync("birthdays.csv", "utf8")
    .split("\n")
    .slice(1)
    .map((row) => {
      const [lastName, firstName, dateOfBirth, email] = row
        .split(",")
        .map((s) => s.trim()); // Parse the csv and store it as an array of objects and remove the whites spaces with trim()
      return { lastName, firstName, dateOfBirth, email };
    });
}

async function retrieveAllBirthdaysFromDB() {
  // Get all of the friends from the database so that we can use the previous functions to find which have a birthday today
  return new Promise((resolve, reject) => {
    const friends = [];
    db.each(
      `SELECT last_name, first_name, date_of_birth, email FROM friends`,
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
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(friends);
        }
      }
    );
  });
}

function retrieveBirthdaysFromDB(birthday) {
  // Because we are using a database we could only retrieve the birthdays of the friends that have a birthday today so we don't have to filter the array like we did with the CSV
  return new Promise((resolve, reject) => {
    let friends = [];
    db.each(
      `SELECT last_name, first_name, date_of_birth, email FROM friends WHERE substr(date_of_birth, 6) = ?`, // Compare only the month and day part
      birthday,
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
      (err) => {
        if (err) {
          reject(err);
        } else {
          friends = checkLeapDay(friends, birthday);
          resolve(friends);
        }
      }
    );
  });
}

sendGreeting(getBirthdayFriends(retrieveAllBirthdaysFromCSV()), "email"); // Will do nothing unless it is someone's birthday
sendGreeting(getBirthdayFriends(await retrieveAllBirthdaysFromDB()), "email"); // Will do nothing unless it is someone's birthday
sendGreeting(
  await retrieveBirthdaysFromDB("1975/09/11".split("/").slice(1).join("/")),
  "email"
); // Specify the date and it will send a greeting if there are any birthdays on that date
