import { retrieveBirthdaysFromDB } from "./src/utils/retrieveBirthdaysFromDB.js";
import { retrieveBirthdaysFromCSV } from "./src/utils/retrieveBirthdaysFromCSV.js";
import { addNewBirthdayFriendToDB } from "./src/utils/addNewBirthdayFriendToDB.js";
import { deleteBirthdayFriendFromDB } from "./src/utils/deleteBirthdayFriendFromDB.js";
import { retrieveBirthdaysWithinRangeFromDB } from "./src/utils/retrieveBirthdaysWithinRangeFromDB.js";
import { updateBirthdayFriendInDB } from "./src/utils/updateBirthdayFriendInDB.js";
import { sendGreeting } from "./src/utils/sendGreeting.js";

import { sequelize } from "./src/database/connection.js";
import { addData } from "./bootstrap.js";

import { fetchFriendsWithBirthday } from "./src/utils/fetchFriendsWithBirthday.js";

import express from "express";

const app = express();
const port = 3000;
app.use(express.json());
//addData();

app.get("/friends", async (req, res) => {
  const { startDate, endDate } = req.query;
  if (startDate && endDate) {
    // Get all friend objects that have a birthday within the specified range
    retrieveBirthdaysWithinRangeFromDB(startDate, endDate)
      .then((friends) => {
        res.status(200).send(friends);
      })
      .catch((err) => {
        res.status(err.status).send(err);
      });
  } else if (startDate) {
    // Get all friend objects that have a birthday on the specified date
    fetchFriendsWithBirthday(startDate)
      .then((friends) => {
        res.status(200).send(friends);
      })
      .catch((err) => {
        res.status(err.status).send(err);
      });
  } else {
    res.status(400).send("Missing query parameters.");
  }
});

app.post("/friends/greetings", (req, res) => {
  // Send a greeting to all friends that have a birthday on the specified date
  const { date, service } = req.body;
  fetchFriendsWithBirthday(date)
    .then((friends) => {
      sendGreeting(friends, service)
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          res.status(err.status).send(err);
        });
    })
    .catch((err) => {
      res.status(err.status).send(err);
    });
});

app.post("/friends/friend", (req, res) => {
  // Add a new friend to the database
  const { lastName, firstName, dateOfBirth, email } = req.body;
  addNewBirthdayFriendToDB(lastName, firstName, dateOfBirth, email)
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      res.status(err.status).send(err);
    });
});

app.delete("/friends/:email", (req, res) => {
  // Delete a friend from the database
  const email = params.email;
  deleteBirthdayFriendFromDB(email)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(err.status).send(err);
    });
});

app.patch("/friend/:email", (req, res) => {
  // Update a friend's information in the database
  const { lastName, firstName, dateOfBirth, email } = req.body;
  const searchEmail = req.params.email;
  updateBirthdayFriendInDB(lastName, firstName, dateOfBirth, email, searchEmail)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(err.status).send(err);
    });
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
