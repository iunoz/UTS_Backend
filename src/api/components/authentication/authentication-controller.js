const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (loginSuccess) {
      resetAttempt(email); //reset percobaan login ketika berhasil masuk
      return response.status(200).json(loginSuccess);
    } else {
      const loginAttempt = authenticationServices.getAttempt(email);
      const timestamp = new Date(loginAttempt.timestamp).toISOString();
      if (loginAttempt.count < 5) {
        throw errorResponder(
          errorTypes.FORBIDDEN,
          `[${timestamp}] ${email} login failed. Attempt = ${loginAttempt.count}.`
        );
      } else if (loginAttempt.count === 5) {
        throw errorResponder(
          errorTypes.FORBIDDEN,
          `[${timestamp}] ${email} login failed. Attempt = ${loginAttempt.count}. Limit Reached`
        );
      } else {
        throw errorResponder(
          errorTypes.FORBIDDEN,
          `Too many login attempts. Try again later!!!`
        );
      }
    }
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
