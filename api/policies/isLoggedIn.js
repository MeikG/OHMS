/**
 * isLoggedIn.js
 *
 * @module      :: Policy
 * @description :: Ensures that a user provides a valid JWT.
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */

module.exports = function isLoggedIn (req, res, next) {
  var token = req.cookies[sails.config.jwt.cookieName];

  // Not logged in, reject the request.
  if (! token) return res.forbidden();

  // Validate the provided JWT.
  Tokens.getClaims(token, function (err) {
    // Token is invalid, the user is attempting to impersonate a valid user.
    if (err) return res.forbidden(err);

    // User has provided a valid JWT and is logged in.
    next();
  });
};
