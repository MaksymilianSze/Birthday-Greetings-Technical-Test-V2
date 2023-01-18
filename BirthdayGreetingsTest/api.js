import { retrieveBirthdaysFromDB } from "./retrieveBirthdaysFromDB.js";
import { retrieveBirthdaysFromCSV } from "./retrieveBirthdaysFromCSV.js";
import { addNewBirthdayFriendToDB } from "./addNewBirthdayFriendToDB.js";
import { deleteBirthdayFriendFromDB } from "./deleteBirthdayFriendFromDB.js";
import { retrieveBirthdaysWithinRangeFromDB } from "./retrieveBirthdaysWithinRangeFromDB.js";
import { updateBirthdayFriendInDB } from "./updateBirthdayFriendInDB.js";
import { sendGreeting } from "./sendGreeting.js";

import express from "express";

const app = express();
const port = 3000;
app.use(express.json());

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
    retrieveBirthdaysFromDB(startDate)
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
  retrieveBirthdaysFromDB(date)
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

app.delete("/friends/friend/:email", (req, res) => {
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

app.patch("/friend/update-friend/:email", (req, res) => {
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
