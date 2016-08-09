/**
 * RecipeIngredientsController.js
 *
 * @description :: View, add and edit recipe ingredients.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  /*
   * Create a new ingredient.
   */
  createIngredient: function (req, res) {
    var token = req.cookies[sails.config.jwt.cookieName];
    var data = req.body;
    RecipeIngredients.createIngredient(data, token, function (err, newIngredient) {
      if (err) return res.negotiate(err);
      return res.ok(newIngredient);
    });
  },

  /*
   * Add, edit and remove bulk ingredients.
   */
  patch: function (req, res) {
    var token = req.cookies[sails.config.jwt.cookieName];
    var data = req.param('data');
    // Find that the ingredient in question exists.
    var result = {
      pass: [],
      fail: []
    };
    var legalFields = ['name', 'measurement', 'amount'];
    // Perform all commands asynchronously.
    async.each(data, function (command, cb) {
      // Populate our id and field variables from the path.
      var [, id, field] = command.path.split('/');
      switch (command.op) {
        default:
          result.fail.push(command);
          cb();
          break;
        case 'add':
          // Add a new ingredient.
          RecipeIngredients.createIngredient(command.value, token, function (err, ingredient) {
            if (err) {
              // Log the error in at silly logging level, but do not return it to the user.
              sails.log.silly(err);
              result.fail.push(command);
              cb();
            } else {
              // Insert the result of the createIngredient into the pass object.
              var updatedCommand = command;
              updatedCommand.result = ingredient;
              result.pass.push(updatedCommand);
              cb();
            }
          });
          break;
        case 'replace':
          // Edit a single field for an ingredient.
          if (legalFields.indexOf(field) === -1) {
            // The user has not selected a legal field to edit, so reject here.
            result.fail.push(command);
            cb();
          } else {
            // Edit the field of the ingredient.
            RecipeIngredients.editIngredient({id}, {[field]: command.value}, token, function (err, ingredient) {
              if (err) {
                sails.log.silly(err);
                result.fail.push(command);
                cb();
              } else {
                // Return the updated object.
                var updatedCommand = command;
                updatedCommand.result = ingredient;
                result.pass.push(updatedCommand);
                cb();
              }
            });
          }
          break;
        case 'delete':
          // Delete an ingredient.
          RecipeIngredients.deleteIngredient(id, token, function (err) {
            if (err) {
              sails.log.silly(err);
              result.fail.push(command);
              cb();
            } else {
              result.pass.push(command);
              cb();
            }
          });
          break;
      }
    },
    function (err) {
      // After all of the async operations have completed, return the results of the operations.
      if (err) return res.negotiate(err);
      if (result.fail.lengh === 0) {
        // As long as we've not got any errors, return 200 and the results.
        return res.ok(result);
      } else {
        // Otherwise indicate that at least one command failed.
        return res.badRequest(result);
      }
    });
  },


};
