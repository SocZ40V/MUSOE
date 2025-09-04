function validateEmail(email) {
  // https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript/
  const re = /.*@.*/;
  return re.test(email);
}

module.exports = {
  validateEmail
};