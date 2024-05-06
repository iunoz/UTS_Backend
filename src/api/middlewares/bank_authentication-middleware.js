const passport = require('passport');
const passportJWT = require('passport-jwt');

const config = require('../../core/config');
const { BankAccount } = require('../../models');

// Authenticate user based on the JWT token
passport.use(
  'bankAccount',
  new passportJWT.Strategy(
    {
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderWithScheme('jwt'),
      secretOrKey: config.secret.jwt,
    },
    async (payload, done) => {
      const bankAccount = await BankAccount.findOne({
        id: payload.bankAccount_id,
      });
      return bankAccount ? done(null, bankAccount) : done(null, false);
    }
  )
);

module.exports = passport.authenticate('bankAccount', { session: false });
