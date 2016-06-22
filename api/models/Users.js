/**
* Users.js
*
* @description :: Table of registered users
* @docs        :: http://sailsjs.org/#!documentation/models
*/

// Use bcrypt to hash our passwords.
var bcrypt = require('bcrypt');

module.exports = {
  attributes: {
    id: {
      type: 'integer',
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    },
    email: 'string',
    fullName: 'string',
    password: 'string'
  },

  /*
   *  Create a new user record.
   *
   *  @param  email     {string}
   *          fullName  {string}
   *          password  {string}
   *
   *  @returns {object} The newly created user object.
   */
  createUser(email, fullName, password, cb) {
    if (sails.config.site.allowSignups === true) {
      // See if the email address is already in the system.
      Users.findOne({email: email}).exec(function (err, foundUser) {
        if (foundUser) {
          return cb(400);
        } else {
          // Hash the password and store it in the database.
          bcrypt.hash(password, 10, function(err, hashedPassword) {
            if (err) return cb(err);
            // Insert the record and return it.
            Users.create({email: email, fullName: fullName, password: hashedPassword}).exec(function(err, user) {
              if (err) return cb(err);
              return cb(null, user);
            });
          });
        }
      });
    } else {
      return cb(403);
    }

  },

  /*
   *  Validate if a user has entered the correct password
   *
   *  @param  email     {string}
   *          password  {string}
   *
   *  @returns {bool} returns true is password is correct.
   */
  validateUser(email, password, cb) {
    // Find the user in the database.
    Users.findOne({email: email}).exec(function (err, user) {
      // Ensure we've got a record.
      if (user) {
        // Compare the password and see if it's correct.
        bcrypt.compare(password, user.password, function(err, correct) {
          if (correct) {
            // Delete the password field, and return the user record.
            delete user.password;
            return cb(null, user);
          } else {
            // Password incorrect.
            sails.log.silly('password for ' + email + ' incorrect');
            return cb(401);
          }
        });
      } else {
        // No user record.
        sails.log.silly('user ' + email + ' not found in Users table');
        return cb(401);
      }
    });
  },

  /*
   *  Update a user's password.
   *
   *  @param  email       {string}
   *          oldPassword {string}
   *          newPassword {string}
   *
   *  @returns {bool} returns true if a password change has happened.
   */
  updatePassword(email, oldPassword, newPassword, cb) {
    // Validate that the user has provided us with the correct old password.
    Users.validateUser(email, oldPassword, function (err) {
      if (err) return cb(401);
      // Hash the new password and store it with the user.
      bcrypt.hash(newPassword, 10, function(err, hashedPassword) {
        if (err) return cb(err);
        Users.update({email: email}, {password: hashedPassword}).exec(function (err) {
          if (err) return cb(err);
          return cb(null, true);
        });
      });

    });
  }
};
