function useEmailService(email, subject, body) {
  // TODO: Send email using email service
}

function useSMSService(phoneNumber, body) {
  // TODO: Send sms using sms service
}

const subject = "Happy birthday!";

export function sendGreeting(birthdayFriends, service) {
  if (typeof service === "email" || typeof service === "sms") {
    throw new Error(
      "The service parameter must be a string that is either 'email' or 'sms'."
    );
  }
  if (birthdayFriends.length < 1) {
    throw new Error(
      "There must be atleast one friend with a birthday to send a greeting."
    );
  }
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
      console.log(
        `Sending sms to ${friend.phoneNumber} with body: ${body}. Note: phone numbers haven't been implemented so it will show as undefined`
      ); // The data provided doesn't have phone numbers but if it did it would be part of the friend object so for now it will be undefined
    }
  }
}
