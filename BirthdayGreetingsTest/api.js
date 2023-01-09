import {
  sendGreeting,
  getBirthdayFriends,
  retrieveAllBirthdaysFromCSV,
  retrieveAllBirthdaysFromDB,
  retrieveBirthdaysFromDB,
} from "./greeting.js";

import express from "express";

const app = express();
const port = 3000;

app.get("/birthdays/:date", (req, res) => {
  // This is the route that we will use to get the birthdays from the database, the date is passed in as a parameter in the url in format mm/dd
  let date = req.params.date;
  date = date.slice(0, 2) + "/" + date.slice(2);
  console.log(date);
  retrieveBirthdaysFromDB(date)
    .then((friends) => {
      res.send(friends);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.get("/url", (req, res, next) => {
  res.json(["Tony", "Lisa", "Michael", "Ginger", "Food"]);
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
