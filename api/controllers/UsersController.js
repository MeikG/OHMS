/**
 * UsersController.js
 *
 * @description :: Creates and validates user credentials.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var ms = require('ms');

module.exports = {
  /*
   * Create a new user.
   */
  createUser: function(req, res) {
    // Grab the form data.
    var email = req.param('email');
    var fullName = req.param('fullName');
    var password = req.param('password');
    // Ensure that we've got some data for each of these fields.
    if (! email || ! fullName || ! password) {
      return res.badRequest();
    }
    // Create the user and store the record.
    Users.createUser(email, fullName, password, function(err, user) {
      if (err) {
        switch (err) {
          default:
            return res.serverError(err);
          case '400':
            return res.badRequest(err);
          case '403':
            return res.forbidden(err);
        }
      }
      delete user.password;
      delete user.createdAt;
      delete user.updatedAt;
      // Create a JWT and sign the user into the system.
      Tokens.createJwt(user, function (err, jwt) {
        if (err) return res.serverError(err);
        // Package the JWT into a cookie that expires when it does, and return with the response.
        res.cookie(sails.config.jwt.cookieName, jwt, {
          domain: sails.config.jwt.audience,
          expires: new Date(Date.now() + ms(sails.config.jwt.validFor)),
          httpOnly: true
        });
        return res.ok(jwt);
      });
    });
  },

  /*
   * Validates a user logging on to the system.
   */
  validateUser: function (req, res) {
    // Grab the form data.
    var email = req.param('email');
    var password = req.param('password');
    // Ensure that we've got some data for each of these fields.
    if (! email || ! password) {
      return res.badRequest();
    }
    // Validate that the credentials are correct.
    Users.validateUser(email, password, function(err, user) {
      if (err) {
        switch (err) {
          default:
            return res.serverError(err);
          case '401':
            return res.forbidden(err);
        }
      }
      // Clean up the user object further.
      delete user.createdAt;
      delete user.updatedAt;
      // Convert the user object into a JSON Web Token.
      Tokens.createJwt(user, function (err, jwt) {
        if (err) return res.serverError(err);
        // Package the JWT into a cookie that expires when it does, and return with the response.
        res.cookie(sails.config.jwt.cookieName, jwt, {
          domain: sails.config.jwt.audience,
          expires: new Date(Date.now() + ms(sails.config.jwt.validFor)),
          httpOnly: true
        });
        return res.ok(jwt);
      });
    });
  },

  /*
   * Updates a user password to a new password.
   */
  updatePassword: function (req, res) {
    // Grab the form data.
    var email = req.param('email');
    var oldPassword = req.param('oldPassword');
    var newPassword = req.param('newPassword');
    // Ensure that we've got some data for each of these fields.
    if (! email || ! oldPassword || ! newPassword) {
      return res.badRequest();
    }
    // Update the password with the new one.
    Users.updatePassword(email, oldPassword, newPassword, function(err, correct) {
      if (err) {
        switch (err) {
          default:
            return res.serverError(err);
          case '401':
            return res.forbidden(err);
        }
      }
      if (correct) {
        return res.ok();
      } else {
        return res.badRequest();
      }
    });
  },
};
