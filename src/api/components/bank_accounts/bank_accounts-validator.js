const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);

module.exports = {
  createBankAccount: {
    body: {
      full_name: joi.string().required().label('Full Name'),
      email: joi.string().email().required().label('Email'),
      phone_number: joi.number().required().label('Phone Number'),
      access_password: joi.string().required().label('Access Password'),
      access_password_confirm: joi
        .string()
        .required()
        .label('Access Password Confirmation'),
      pin_code: joi.string().required().label('Pin Code'),
      pin_code_confirm: joi.string().required().label('Pin Code Confirmation'),
      card_number: joi.number().label('Card Number'),
      balance: joi.number().required().label('Balance'),
    },
  },

  updateBankAccount: {
    body: {
      full_name: joi.string().required().label('Name'),
      email: joi.string().email().required().label('Email'),
      access_password: joi.string().required().label('Access Password'),
      access_password_confirm: joi
        .string()
        .required()
        .label('Access Password Confirmation'),
    },
  },

  changeAccessPassword: {
    body: {
      access_password_old: joi.string().required().label('Old Access Password'),
      access_password_new: joi.string().required().label('New Access Password'),
      access_password_confirm: joi
        .string()
        .required()
        .label('Access Password Confirmation'),
    },
  },

  changePinCode: {
    body: {
      pin_code_old: joi.string().required().label('Old Pin Code'),
      pin_code_new: joi.string().required().label('NewPin Code'),
      pin_code_confirm: joi.string().required().label('Pin Code Confirmation'),
    },
  },
};
