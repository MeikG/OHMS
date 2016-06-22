/**
* Tokens.js
*
* @description :: Model for handling JWTs.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var jwt = require('jsonwebtoken');
var secureRandom = require('secure-random');
var ms = require('ms');

module.exports = {
  /*
   *  Creates a signed JSON Web Token.
   *
   *  @param  claims {object} An object of claims made by this server.
   *  @returns {string} The newly created and signed JWT.
   */
  createJwt(claims, cb) {
    // Convert the pretty validFor into milliseconds.
    var validFor = ms(sails.config.jwt.validFor);

    // Generate the xsrfToken to prevent cross-site forgeries, and inject into the claims.
    if (typeof claims.xsrfToken === 'undefined') {
      var xsrfToken = new Buffer(secureRandom(32).join('')).toString('base64');
      claims.xsrfToken = xsrfToken;
    }

    // Create a payload object to be used in the JWT.
    var payload = {
      iat: Date.now(),                  // Issued at.
      exp: Date.now() + validFor,       // Expires in (time).
      iss: sails.config.site.address,   // Issuer.
      aud: sails.config.jwt.audience,   // Audience.
      claims: claims                    // Finally, the claims to be encoded in the JWT.
    };

    // Sign the JWT and return it.
    jwt.sign(payload, sails.config.jwt.secret, { algorithm: 'HS256' }, function(err, token) {
      if (err) return cb(err);
      return cb(null, token);
    });
  },

  /*
   * Gets the full payload from a verified JWT.
   *
   * @param {string} token      JSON Web Token.
   * @returns {object} Authenticated payload of a JWT.
   */
  getPayload(token, cb) {
    jwt.verify(token, sails.config.jwt.secret, function(err, decoded) {
      if (err) return cb(err);
      return cb(null, decoded);
    });
  },

  /*
   * Gets the claims from a JWT.
   *
   * @param {string} token      JSON Web Token.
   * @returns {object} Authenticated claims made by JWT.
   */
  getClaims(token, cb) {
    jwt.verify(token, sails.config.jwt.secret, function(err, decoded) {
      if (err) return cb(err);
      return cb(null, decoded.claims);
    });
  }

};
