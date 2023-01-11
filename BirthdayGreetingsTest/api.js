import { retrieveBirthdaysFromDB } from "./retrieveBirthdaysFromDB.js";
import { retrieveBirthdaysFromCSV } from "./retrieveBirthdaysFromCSV.js";
import { sendGreeting } from "./sendGreeting.js";

import express from "express";

const app = express();
const port = 3000;

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

app.post("/birthdays/send-greeting/:date", (req, res) => {
  // Send a greeting to all friends that have a birthday on the specified date
  const date = req.params.date;
  retrieveBirthdaysFromDB(date)
    .then((friends) => {
      sendGreeting(friends, "ema")
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

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
