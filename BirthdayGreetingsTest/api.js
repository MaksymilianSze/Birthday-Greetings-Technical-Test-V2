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

app.get("/birthdays/:date", async (req, res) => {
  // Get all friend objects that have a birthday on the specified date
  const date = req.params.date;
  retrieveBirthdaysFromDB(date)
    .then((friends) => {
      res.send(friends);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.get("/birthdays/range/:startDate/:endDate", async (req, res) => {
  // Get all friend objects that have a birthday within the specified range
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;
  retrieveBirthdaysWithinRangeFromDB(startDate, endDate)
    .then((friends) => {
      res.send(friends);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.post("/birthdays/send-greeting/:date/:service", (req, res) => {
  // Send a greeting to all friends that have a birthday on the specified date
  const date = req.params.date;
  const service = req.params.service;
  retrieveBirthdaysFromDB(date)
    .then((friends) => {
      sendGreeting(friends, service)
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          console.log(
            "The service parameter must be a string that is either 'email' or 'sms'."
          );
          res.status(400).send(err);
        });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.put("/birthdays/add-friend", (req, res) => {
  // Add a new friend to the database
  const { lastName, firstName, dateOfBirth, email } = req.body;
  addNewBirthdayFriendToDB(lastName, firstName, dateOfBirth, email)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.delete("/birthdays/delete-friend/:email", (req, res) => {
  // Delete a friend from the database
  const email = req.params.email;
  deleteBirthdayFriendFromDB(email)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.patch("/birthdays/update-friend/:email", (req, res) => {
  // Update a friend's information in the database
  const { lastName, firstName, dateOfBirth, email } = req.body;
  const searchEmail = req.params.email;
  updateBirthdayFriendInDB(lastName, firstName, dateOfBirth, email, searchEmail)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
