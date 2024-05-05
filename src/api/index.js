const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const bank_accounts = require('./components/bank_accounts/bank_accounts-route');
module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  bank_accounts(app);

  return app;
};
