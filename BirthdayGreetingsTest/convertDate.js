// Regular expression to match the date format
const dateRegex = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

export function convertDate(date) {
  return new Promise((resolve, reject) => {
    if (!dateRegex.test(date)) {
      reject({
        status: 400,
        message: `Invalid date format. Expected "yyyy-mm-dd", but got ${date}`,
      });
    } else {
      // use the Date object to check if the date is valid
      const dateObject = new Date(date);
      // If any one of these is not the same then it means the date is invalid
      if (
        dateObject.getFullYear() != date.substring(0, 4) ||
        dateObject.getMonth() != date.substring(5, 7) - 1 ||
        dateObject.getDate() != date.substring(8, 10)
      ) {
        reject({
          status: 400,
          message: `The date: ${date} is not a valid date`,
        });
      } else {
        // Replace - with / and return the new date
        const newDate = date.replace(/-/g, "/");
        console.log(`Successfully converted ${date} to ${newDate}`);
        resolve(newDate);
      }
    }
  });
}
