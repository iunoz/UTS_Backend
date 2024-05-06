const bankAccountsService = require('./bank_accounts-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of bank accounts request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getBankAccounts(request, response, next) {
  try {
    const bankAccounts = await bankAccountsService.getBankAccounts();
    return response.status(200).json(bankAccounts);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get bank account detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getBankAccount(request, response, next) {
  try {
    const bankAccount = await bankAccountsService.getBankAccount(
      request.params.id
    );

    if (!bankAccount) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(bankAccount);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create bank account request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createBankAccount(request, response, next) {
  try {
    const full_name = request.body.full_name;
    const email = request.body.email;
    const phone_number = request.body.phone_number;
    const access_password = request.body.access_password;
    const access_password_confirm = request.body.access_password_confirm;
    const pin_code = request.body.pin_code;
    const pin_code_confirm = request.body.pin_code_confirm;
    const card_number = request.body.card_number;
    const balance = request.body.balance;

    // Check confirmation access password
    if (access_password !== access_password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Access password confirmation mismatched'
      );
    }

    if (pin_code !== pin_code_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'pin code confirmation mismatched'
      );
    }

    // email must be unique
    const emailIsRegistered =
      await bankAccountsService.emailIsRegistered(email);
    if (emailIsRegistered) {
      throw errorResponder('Email is already registered');
    }

    // phone number must be unique
    const phoneNumberIsRegistered =
      await bankAccountsService.phoneNumberIsRegistered(phone_number);
    if (phoneNumberIsRegistered) {
      throw errorResponder('Phone number is already registered');
    }
    const account_number = Math.floor(1000000000 + Math.random() * 9000000000);
    const success = await bankAccountsService.createBankAccount(
      full_name,
      email,
      phone_number,
      access_password,
      pin_code,
      card_number,
      balance,
      account_number
    );

    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create account'
      );
    }

    return response.status(200).json({
      full_name,
      email,
      phone_number,
      card_number,
      balance,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update bank account request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateBankAccount(request, response, next) {
  try {
    const id = request.params.id;
    const email = request.body.email;

    // Email must be unique
    const emailIsRegistered =
      await bankAccountsService.emailIsRegistered(email);
    if (emailIsRegistered) {
      throw errorResponder('Email is already registered');
    }

    const success = await bankAccountsService.updateBankAccount(id, email);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete bank account request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteBankAccount(request, response, next) {
  try {
    const id = request.params.id;

    const success = await bankAccountsService.deleteBankAccount(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ message: 'Customer has been delete' });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle change bank account access password request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function changeAccessPassword(request, response, next) {
  try {
    // Check access password confirmation
    if (
      request.body.access_password_new !== request.body.access_password_confirm
    ) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Access Password confirmation mismatched'
      );
    }

    // Check old access password
    if (
      !(await bankAccountsService.checkAccessPassword(
        request.params.id,
        request.body.access_password_old
      ))
    ) {
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong access password'
      );
    }

    const changeAccessPasswordSuccess =
      await bankAccountsService.changeAccessPassword(
        request.params.id,
        request.body.access_password_new
      );

    if (!changeAccessPasswordSuccess) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to change access password'
      );
    }

    return response.status(200).json({ id: request.params.id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle change bank account access password request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function changePinCode(request, response, next) {
  try {
    // Check pin code confirmation
    if (request.body.pin_code_new !== request.body.pin_code_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Pin code confirmation mismatched'
      );
    }

    // Check old pin code
    if (
      !(await bankAccountsService.checkPinCode(
        request.params.id,
        request.body.pin_code_old
      ))
    ) {
      throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'Wrong pin code');
    }

    const changePinCodeSuccess = await bankAccountsService.changePinCode(
      request.params.id,
      request.body.pin_code_new
    );

    if (!changePinCodeSuccess) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to change pin code'
      );
    }

    return response.status(200).json({ id: request.params.id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getBankAccounts,
  getBankAccount,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
  changeAccessPassword,
  changePinCode,
};
