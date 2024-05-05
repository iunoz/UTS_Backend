const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);

module.exports = {
  createBankAccount: {
    body: {
      full_name: joi.string().min(1).max(100).required().label('Full Name'),
      email: joi.string().email().required().label('Email'),
      phone_number: joi
        .number()
        .min(11)
        .max(13)
        .required()
        .label('Phone Number'),
      access_password: joiPassword
        .string()
        .minOfSpecialCharacters()
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .onlyLatinCharacters()
        .min(6)
        .max(12)
        .required()
        .label('Access Password'),
      access_password_confirm: joi
        .string()
        .required()
        .label('Access Password confirmation'),
      pin_code: joi.number().min(6).max(6).required().label('Pin Code'),
      pin_code_confirm: joi.number().required().label('Pin Code Confirmation'),
      card_number: joi.number().min(16).max(16).label('Card Number'),
      balance: joi.number().min(1).max(100).required().label('Balance'),
    },
  },

  updateBankAccount: {
    body: {
      name: joi.string().min(1).max(100).required().label('Name'),
      email: joi.string().email().required().label('Email'),
    },
  },

  changeAccessPassword: {
    body: {
      access_password_old: joi.string().required().label('Old Access Password'),
      access_password_new: joiPassword
        .string()
        .minOfSpecialCharacters()
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .onlyLatinCharacters()
        .min(6)
        .max(12)
        .required()
        .label('New Access Password'),
      access_password_confirm: joi
        .string()
        .required()
        .label('Access Password Confirmation'),
    },
  },

  changePinCode: {
    body: {
      pin_code_old: joi.number().required().label('Old Pin Code'),
      pin_code_new: joi.number().min(6).max(6).required().label('NewPin Code'),
      pin_code_confirm: joi.string().required().label('Pin Code Confirmation'),
    },
  },
};
