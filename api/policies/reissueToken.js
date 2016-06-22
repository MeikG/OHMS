/**
 * reissueToken.js
 *
 * @module      :: Policy
 * @description :: Reissues a validated JSON Web Token.
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */

var ms = require('ms');

module.exports = function reissueToken (req, res, next) {
  var token = req.cookies[sails.config.jwt.cookieName];

  if (! token) {
    // If there is no token, proceed without reissuing anything.
    next();
  } else {
    Tokens.getPayload(token, function (err, claims) {
      if (err) {
        // Token is invalid, do not provide a new one.
        next();
      } else {
        if (claims) {
          // Reissue the token when less than 75% life remaining.
          var timestamp = Math.floor(Date.now());
          var timeRemaining = (claims.iat + ((claims.exp - claims.iat) * (sails.config.jwt.reissuePercent / 100)));

          if (timestamp > timeRemaining) {
            sails.log('Reissuing Token');
            // Build a new JSON Web Token
            Tokens.createJwt(claims.claims, function (err, newToken) {
              // Set an authorisation cookie with the same expiry time as the JWT.
              res.cookie(sails.config.jwt.cookieName, newToken, {
                domain: sails.config.jwt.audience,
                expires: new Date(Date.now() + ms(sails.config.jwt.validFor)),
                httpOnly: true
              });
              next();
            });
          } else {
            // Still time remaining, do not reissue.
            next();
          }

        }
      }
    });
  }
};
