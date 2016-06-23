/**
 * xsrfProtection.js
 *
 * @module      :: Policy
 * @description :: All non-GET routes will need to be validated against the xsrf field in the JWT
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */

module.exports = function usersOwner (req, res, next) {
  var token = req.cookies[sails.config.jwt.cookieName];
  var verb = req.method;
  if (verb === 'GET') {
    // No need to protect against GET requests.
    next();
  } else {
    // If there's no xsrf header set, fail.
    var xsrfToken = req.body.xsrfToken;
    if (! xsrfToken) return res.forbidden('xsrf token missing');
    // Get the xsrfToken claim from the JWT, and compare against submitted header.
    Tokens.getClaims(token, function (err, claims) {
      if (err) return res.forbidden(err);
      // Only proceed if they match, or return an error message.
      if (claims.xsrfToken === xsrfToken) {
        next();
      } else {
        return res.forbidden('xsrf token invalid');
      }
    });
  }
};
