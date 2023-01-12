import { retrieveBirthdaysFromDB } from "./retrieveBirthdaysFromDB.js";
import { retrieveBirthdaysFromCSV } from "./retrieveBirthdaysFromCSV.js";
import { addNewBirthdayFriendToDB } from "./addNewBirthdayFriendToDB.js";
import { deleteBirthdayFriendFromDB } from "./deleteBirthdayFriendFromDB.js";
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
  const email = req.params.email;

  deleteBirthdayFriendFromDB(email)
    .then(() => {
      res
        .status(200)
        .send(
          `Successfully deleted friend with email ${email} from the database`
        );
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
