const { BankAccount } = require('../../../models');

/**
 * Get a list of bank accounts
 * @returns {Promise}
 */
async function getBankAccounts() {
  return BankAccount.find({});
}

/**
 * Get bank account detail
 * @param {string} id - Bank Account ID
 * @returns {Promise}
 */
async function getBankAccount(id) {
  return BankAccount.findById(id);
}

/**
 * Create new bank account
 * @param {string} full_name - Full Name
 * @param {string} email - Email
 * @param {number} phone_number - Phone Number
 * @param {string} access_password - Hashed access_password
 * @param {number} pin_code - Hashed Pin Code
 * @param {number} balance - Amount of balance
 * @returns {Promise}
 */
async function createBankAccount(
  full_name,
  email,
  phone_number,
  access_password,
  pin_code,
  balance
) {
  return BankAccount.create({
    full_name,
    email,
    phone_number,
    access_password,
    pin_code,
    balance,
  });
}

/**
 * Update existing bank account
 * @param {string} id - Bank Account ID
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateBankAccount(id, email) {
  return BankAccount.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        email,
      },
    }
  );
}

/**
 * Delete a bank account
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteBankAccount(id) {
  return BankAccount.deleteOne({ _id: id });
}

/**
 * Get bank account by email to prevent duplicate
 * @param {string} email - email
 * @returns {Promise}
 */
async function getBankAccountByEmail(email) {
  return BankAccount.findOne({ email });
}

/**
 * Get bank account by phone number to prevent duplicate
 * @param {string} phone_number - phone number
 * @returns {Promise}
 */
async function getBankAccountByPhoneNumber(phone_number) {
  return BankAccount.findOne({ phone_number });
}

/**
 * Update access password
 * @param {string} id - bank account ID
 * @param {string} access_password - New hashed access_password
 * @returns {Promise}
 */
async function changeAccessPassword(id, access_password) {
  return BankAccount.updateOne({ _id: id }, { $set: { access_password } });
}

/**
 * Update pin code
 * @param {string} id - bank account ID
 * @param {string} pin_code - New hashed pin_code
 * @returns {Promise}
 */
async function changePinCode(id, pin_code) {
  return BankAccount.updateOne({ _id: id }, { $set: { pin_code } });
}

module.exports = {
  getBankAccounts,
  getBankAccount,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
  getBankAccountByEmail,
  getBankAccountByPhoneNumber,
  changeAccessPassword,
  changePinCode,
};
