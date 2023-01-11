export function convertDate(date) {
  // Regular expression to match the date format
  const dateRegex = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

  if (!dateRegex.test(date)) {
    throw new Error(
      `Invalid date format. Expected "yyyy-mm-dd", but got ${date}`
    );
  } else {
    // use the Date object to check if the date is valid
    const dateObject = new Date(date);
    // If any one of these is not the same then it means the date is invalid
    if (
      dateObject.getFullYear() != date.substring(0, 4) ||
      dateObject.getMonth() != date.substring(5, 7) - 1 ||
      dateObject.getDate() != date.substring(8, 10)
    ) {
      throw new Error(`The date: ${date} is not a valid date`);
    } else {
      // Replace - with / and return the new date
      const newDate = date.replace(/-/g, "/");
      console.log(`Successfully converted ${date} to ${newDate}`);
      return newDate;
    }
  }
}
