const bankAccountsRepository = require('./bank_accounts-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of bank account
 * @returns {Array}
 */
async function getBankAccounts() {
  const bankAccounts = await bankAccountsRepository.getBankAccounts();

  const results = [];
  for (let i = 0; i < bankAccounts.length; i += 1) {
    const bankAccount = bankAccounts[i];
    results.push({
      id: bankAccount.id,
      full_name: bankAccount.full_name,
      email: bankAccount.email,
      phone_number: bankAccount.phone_number,
      access_password: bankAccount.access_password,
      pin_code: bankAccount.pin_code,
      card_number: bankAccount.card_number,
      balance: bankAccount.balance,
      account_number: bankAccount.account_number,
    });
  }

  return results;
}

/**
 * Get bank account detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getBankAccount(id) {
  const bankAccount = await bankAccountsRepository.getBankAccount(id);

  // User not found
  if (!bankAccount) {
    return null;
  }

  return {
    id: bankAccount.id,
    full_name: bankAccount.full_name,
    email: bankAccount.email,
    phone_number: bankAccount.phone_number,
    access_password: bankAccount.access_password,
    pin_code: bankAccount.pin_code,
    card_number: bankAccount.card_number,
    balance: bankAccount.balance,
  };
}

/**
 * Create new bank account
 * @param {string} full_name - Full Name
 * @param {string} email - Email
 * @param {number} phone_number - Phone Number
 * @param {string} access_password - Hashed access_password
 * @param {string} pin_code - Hashed Pin Code to hash must string
 * @param {number} card_number - Card Number
 * @param {number} balance - Amount of balance
 * @returns {boolean}
 */
async function createBankAccount(
  full_name,
  email,
  phone_number,
  access_password,
  pin_code,
  card_number,
  balance,
  account_number
) {
  // Hash access password and hash pin code
  const hashedAccessPassword = await hashPassword(access_password);
  const hashedPinCode = await hashPassword(pin_code);
  try {
    await bankAccountsRepository.createBankAccount(
      full_name,
      email,
      phone_number,
      hashedAccessPassword,
      hashedPinCode,
      card_number,
      balance,
      account_number
    );
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing bank account
 * @param {string} id - Bank account ID
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateBankAccount(id, email) {
  const bankAccount = await bankAccountsRepository.getBankAccount(id);

  // Bank account not found
  if (!bankAccount) {
    return null;
  }

  try {
    await bankAccountsRepository.updateBankAccount(id, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete bank accout
 * @param {string} id - bank account ID
 * @returns {boolean}
 */
async function deleteBankAccount(id) {
  const bankAccount = await bankAccountsRepository.getBankAccount(id);

  // User not found
  if (!bankAccount) {
    return null;
  }

  try {
    await bankAccountsRepository.deleteBankAccount(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const bankAccount = await bankAccountsRepository.getBankAccountByEmail(email);

  if (bankAccount) {
    return true;
  }

  return false;
}

/**
 * Check whether the phone number is registered
 * @param {number} phone_number - Phone number
 * @returns {boolean}
 */
async function phoneNumberIsRegistered(phone_number) {
  const bankAccount =
    await bankAccountsRepository.getBankAccountByPhoneNumber(phone_number);

  if (bankAccount) {
    return true;
  }

  return false;
}

/**
 * Check whether the access password is correct
 * @param {string} bankAccountId - User ID
 * @param {string} access_password - Access Password
 * @returns {boolean}
 */
async function checkAccessPassword(bankAccountId, access_password) {
  const bankAccount =
    await bankAccountsRepository.getBankAccount(bankAccountId);
  return passwordMatched(access_password, bankAccount.access_password);
}

/**
 * Check whether the pin code is correct
 * @param {string} bankAccountId - User ID
 * @param {string} pin_code - Pin code
 * @returns {boolean}
 */
async function checkPinCode(bankAccountId, pin_code) {
  const bankAccount =
    await bankAccountsRepository.getBankAccount(bankAccountId);
  return passwordMatched(pin_code, bankAccount.pin_code);
}

/**
 * Change bank account access password
 * @param {string} bankAccountId - Bank Account ID
 * @param {string} access_password - Access Password
 * @returns {boolean}
 */
async function changeAccessPassword(bankAccountId, access_password) {
  const bankAccount =
    await bankAccountsRepository.getBankAccount(bankAccountId);

  // Check if bank account not found
  if (!bankAccount) {
    return null;
  }

  const hashedAccessPassword = await hashPassword(access_password);

  const changeAccessPasswordSuccess =
    await bankAccountsRepository.changeAccessPassword(
      bankAccountId,
      hashedAccessPassword
    );

  if (!changeAccessPasswordSuccess) {
    return null;
  }

  return true;
}

/**
 * Change bank account pin code
 * @param {string} bankAccountId - Bank Account ID
 * @param {string} pin_code - pin_code
 * @returns {boolean}
 */
async function changePinCode(bankAccountId, pin_code) {
  const bankAccount =
    await bankAccountsRepository.getBankAccount(bankAccountId);

  // Check if bank account not found
  if (!bankAccount) {
    return null;
  }

  const hashedPinCode = await hashPassword(pin_code);

  const changePinCodeSuccess = await bankAccountsRepository.changePinCode(
    bankAccountId,
    hashedPinCode
  );

  if (!changePinCodeSuccess) {
    return null;
  }

  return true;
}

/**
 * Deposit amount into bank account
 * @param {string} bankAccountId - Bank Account Id
 * @param {number} amount - Amount to deposit
 * @returns {boolean}
 */
async function deposit(bankAccountId, amount) {
  const bankAccount =
    await bankAccountsRepository.getBankAccount(bankAccountId);

  if (!bankAccount) {
    return null;
  }

  if (amount <= 0) {
    return null;
  }

  const newBankAccountBalance = bankAccount.balance + amount;
  await bankAccountsRepository.updateBankAccountBalance(bankAccountId, {
    balance: newBankAccountBalance,
  });
  return true;
}

/**
 * Transfer function to another bank
 * @param {string} senderBankAccountId - Sender Id
 * @param {string} receiverBankAccountId - Reveiver If=d
 * @param {number} amount - Amount to transfer
 * @return {boolean}
 */
async function transfer(senderBankAccountId, receiverBankAccountId, amount) {
  const senderBankAccount =
    await bankAccountsRepository.getBankAccount(senderBankAccountId);
  if (!senderBankAccount) {
    return null;
  }

  const receiverBankAccount = await bankAccountsRepository.getBankAccount(
    receiverBankAccountId
  );
  if (!receiverBankAccount) {
    return null;
  }

  if (amount <= 0) {
    return null;
  }

  if (senderBankAccount.balance < amount) {
    return null;
  }

  const newSenderBankAccountBalance = senderBankAccount.Balance - amount;
  await bankAccountsRepository.updateBankAccountBalance(senderBankAccountId, {
    balance: newSenderBankAccountBalance,
  });

  const newReceiverBankAccountBalance = receiverBankAccount.Balance - amount;
  await bankAccountsRepository.updateBankAccountBalance(receiverBankAccountId, {
    balance: newReceiverBankAccountBalance,
  });

  return true;
}

module.exports = {
  getBankAccounts,
  getBankAccount,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
  emailIsRegistered,
  phoneNumberIsRegistered,
  checkAccessPassword,
  checkPinCode,
  changeAccessPassword,
  changePinCode,
  deposit,
  transfer,
};
