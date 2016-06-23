/**
 * RecipeIngredients.js
 *
 * @description :: A list of ingredients assigned to each recipe.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: {
      type: 'integer',
      autoIncrement: true,
      unique: true,
      primaryKey: true
    },
    recipe: {
      model: 'Recipes'
    },
    amount: 'int',
    measurement: 'string',
    name: 'string'
  },

  /*
   *  Creates an ingredient for a recipe.
   *
   *  @param {int} recipe id
   *  @param {int} amount
   *  @param {string} measurement
   *  @param {string} name of ingredient
   *  @param {string} jwt token
   *  @returns {object} Recipe Ingredient
   */
  createIngredient: function (id, amount, measurement, name, token, cb) {
    Tokens.getClaims(token, function (err, claims) {
      Recipes.findOne({id})
      .exec(function (err, record) {
        if (err) return cb(err);
        // If the user did not write the recipe, fail to add the ingredient.
        if (record.writtenBy !== claims.id) return cb(null, null);
        Recipes.findOne({id}).exec(function (err, exists) {
          if (err) return cb(err);
          if (! exists) return cb(null, null);
          RecipeIngredients.create({recipe: id, amount, measurement, name}).exec(function (err, ingredient) {
            if (err) return cb(err);
            return cb(null, ingredient);
          });
        });
      });
    });
  },

  /*
   *  Updates an ingredient in the database.
   *
   *  @param {int} id
   *  @param {object} ingredient
   *  @param {string} jwt token
   *  @returns {object} updated ingredient.
   */
  editIngredient: function (id, ingredient, token, cb) {
    // Grab the token claims.
    Tokens.getClaims(token, function (err, claims) {
      if (err) return cb(err);
      RecipeIngredients.findOne({id})
      .populate('recipe')
      .exec(function (err, record) {
        if (err) return cb(err);
        // Compare against the recipe writer.
        if (record.recipe.writtenBy !== claims.id) return cb(null, null);
        RecipeIngredients.update({id}, ingredient)
        .exec(function (err, updatedIngredient) {
          if (err) return cb(err);
          return cb(null, updatedIngredient);
        });
      });
    });
  }
};
