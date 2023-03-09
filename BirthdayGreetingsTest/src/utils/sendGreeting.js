import logger from "./logger.js";

function useEmailService(email, subject, body) {
  // TODO: Send email using email service
}

function useSMSService(phoneNumber, body) {
  // TODO: Send sms using sms service
}

export function sendGreeting(birthdayFriends, service) {
  return new Promise((resolve, reject) => {
    if (service !== "email" && service !== "sms") {
      logger.error(
        "The service parameter must be a string that is either 'email' or 'sms'."
      );
      reject({
        status: 400,
        message:
          "The service parameter must be a string that is either 'email' or 'sms'.",
      });
    }
    if (birthdayFriends.length < 1) {
      logger.error(
        "No friends with a birthday on the specified date were found."
      );
      reject({
        status: 404,
        message: "No friends with a birthday on the specified date were found.",
      });
    }
    for (const friend of birthdayFriends) {
      // Loop through the array of friends with a birthday and send an email to each friend
      const body = `Happy birthday, dear ${friend.first_name}!`;
      if (service === "email") {
        useEmailService(friend.email, "Happy birthday", body);
        logger.info(
          `Sending email to ${friend.email} with subject: Happy birthday! and body: ${body}`
        );
      } else if (service === "sms") {
        useSMSService(friend.phone_number, body);
        logger.info(
          `Sending sms to ${friend.phone_number} with body: ${body}. Note: phone numbers haven't been implemented so it will show as undefined`
        ); // The data provided doesn't have phone numbers but if it did it would be part of the friend object so for now it will be undefined
      }
    }
    // If all messages are sent successfully, resolve the promise
    logger.info("All greetings have been sent!");
    resolve("All greetings have been sent!");
  });
}
