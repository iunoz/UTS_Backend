const bcrypt = require('bcrypt');

/**
 * Hash a plain text password
 * @param {string} password - The password to be hashed
 * @returns {string}
 */
async function hashPassword(password) {
  const saltRounds = 16;
  const hashedPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });

  return hashedPassword;
}

/**
 * Compares a plain text password and its hashed to determine its equality
 * Mainly use for comparing login credentials
 * @param {string} password - A plain text password
 * @param {string} hashedPassword - A hashed password
 * @returns {boolean}
 */
async function passwordMatched(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

/**
 * Hash a plain text access password
 * @param {string} access_password - The access password to be hashed
 * @returns {string}
 */
async function hashAccessPassword(access_password) {
  const saltRounds = 16;
  const hashedAccessPassword = await new Promise((resolve, reject) => {
    bcrypt.hash(access_password, saltRounds, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });

  return hashedAccessPassword;
}

/**
 * Compares a plain text access password and its hashed to determine its equality
 * Mainly use for comparing login credentials
 * @param {string} access_password - A plain text access password
 * @param {string} hashedAccessPassword - A hashed access password
 * @returns {boolean}
 */
async function accessPasswordMatched(access_password, hashedAccessPassword) {
  return bcrypt.compareSync(access_password, hashedAccessPassword);
}

/**
 * Hash a plain text pin code
 * @param {number} pin_code - The pin code to be hashed
 * @returns {string}
 */
async function hashPinCode(pin_code) {
  const saltRounds = 16;
  const hashedPinCode = await new Promise((resolve, reject) => {
    bcrypt.hash(pin_code, saltRounds, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });

  return hashedPinCode;
}

/**
 * Compares a plain text pin code and its hashed to determine its equality
 * Mainly use for comparing login credentials
 * @param {number} pin_code - A plain text pin code
 * @param {string} hashedPinCode - A hashed pin code
 * @returns {boolean}
 */
async function pinCodeMatched(pin_code, hashedPinCode) {
  return bcrypt.compareSync(pin_code, hashedPinCode);
}

module.exports = {
  hashPassword,
  passwordMatched,
  hashAccessPassword,
  accessPasswordMatched,
  hashPinCode,
  pinCodeMatched,
};
