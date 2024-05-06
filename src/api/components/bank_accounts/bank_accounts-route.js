const express = require('express');

const bankAuthenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const bankAccountsControllers = require('./bank_accounts-controller');
const bankAccountsValidator = require('./bank_accounts-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/bank_accounts', route);

  // Get list of bank accounts
  route.get(
    '/',
    bankAuthenticationMiddleware,
    bankAccountsControllers.getBankAccounts
  );

  // Create bank account
  route.post(
    '/',
    bankAuthenticationMiddleware,
    celebrate(bankAccountsValidator.createBankAccount),
    bankAccountsControllers.createBankAccount
  );

  // Get bank account detail
  route.get(
    '/:id',
    bankAuthenticationMiddleware,
    bankAccountsControllers.getBankAccounts
  );

  // Update bank account
  route.put(
    '/:id',
    bankAuthenticationMiddleware,
    celebrate(bankAccountsValidator.updateBankAccount),
    bankAccountsControllers.updateBankAccount
  );

  // Delete bank account
  route.delete(
    '/:id',
    bankAuthenticationMiddleware,
    bankAccountsControllers.deleteBankAccount
  );

  // Change access password
  route.post(
    '/:id/change-access-password',
    bankAuthenticationMiddleware,
    celebrate(bankAccountsValidator.changeAccessPassword),
    bankAccountsControllers.changeAccessPassword
  );

  //Change pin code
  route.post(
    '/:id/change-pin-code',
    bankAuthenticationMiddleware,
    celebrate(bankAccountsValidator.changeAccessPassword),
    bankAccountsControllers.changePinCode
  );
};
