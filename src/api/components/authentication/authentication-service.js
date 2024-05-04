const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');

//batas max percobaan login dan waktu timeoutnya
const maxAttempt = 5;
const timeoutAttempt = 30 * 60 * 1000; //30 menit

//objek utk menghitung brp kali percobaan login
const attempts = {};

/**
 * Add increment for login attempts
 * @param {string} email - Email
 */
function incrementAttempt(email) {
  if (!attempts[email]) {
    attempts[email] = { count: 1, timestamp: Date.now() };
  } else {
    attempts[email].count++;
    attempts[email].timestamp = Date.now();
  }
}

/**
 * Get infromation about login attempt
 * @param {string} email - Email
 * @returns {object} Login attempt object
 */
function getAttempt(email) {
  return attempts[email] || { count: 0, timestamp: 0 };
}

/**
 *  Reset login attempt
 * @param {string} email - Email
 */
function resetAttempt(email) {
  delete attempts[email];
}

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, password) {
  const user = await authenticationRepository.getUserByEmail(email);

  // We define default user password here as '<RANDOM_PASSWORD_FILTER>'
  // to handle the case when the user login is invalid. We still want to
  // check the password anyway, so that it prevents the attacker in
  // guessing login credentials by looking at the processing time.
  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, userPassword);

  const attempt = getAttempt(email);

  //jika percobaan login melebihi batas dan masih dalam waktu timeout
  if (
    attempt.count >= maxAttempt &&
    Date.now() - attempt.timestamp < timeoutAttempt
  ) {
    return false; //mengembalikan false untuk menandakan akun terkunci
  }

  // Because we always check the password (see above comment), we define the
  // login attempt as successful when the `user` is found (by email) and
  // the password matches.
  if (user && passwordChecked) {
    //reset percobaan login yang gagal untuk email ketika login berhasil
    resetAttempt(email);
    return {
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
    };
  } else {
    incrementAttempt(email); // Tambah jumlah increment jika login gagal

    const attempt = getAttempt(email);
    //cek apakah percobaan loginnya melebihi batas
    if (
      attempt.count >= maxAttempt &&
      Date.now() - attempt.timestamp >= timeoutAttempt
    ) {
      resetAttempt(email); //jika melebihi batas tapi waktu timeout sudah lewat, reset percobaan
    }
    return false; //Menandakan jika login gagal
  }
}

module.exports = {
  checkLoginCredentials,
  incrementAttempt,
  getAttempt,
  resetAttempt,
};
