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
   *  @param {object} ingredient
   *  @param {string} jwt token
   *  @returns {object} Recipe Ingredient
   */
  createIngredient: function (ingredient, token, cb) {
    var ingredientObj = {
      recipe: ingredient.recipe || null,
      name: ingredient.name || null,
      amount: ingredient.amount || null,
      measurement: ingredient.measurement || null
    };
    Tokens.getClaims(token, function (err, claims) {
      Recipes.findOne({id: ingredient.recipe})
      .exec(function (err, record) {
        if (err) return cb(err);
        // If the user did not write the recipe, fail to add the ingredient.
        if (! record || record.writtenBy !== claims.id) return cb('denied');
        RecipeIngredients
        .create(ingredientObj)
        .exec(function (err, newIngredient) {
          if (err) return cb(err);
          return cb(null, newIngredient);
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
  editIngredient: function (id, preUpdate, token, cb) {
    var update = preUpdate;
    // Do not allow the user to edit these fields.
    delete update.id;
    delete update.recipe;
    delete update.createdAt;
    delete update.updatedAt;
    // Grab the token claims.
    Tokens.getClaims(token, function (err, claims) {
      if (err) return cb(err);
      RecipeIngredients.findOne({id})
      .populate('recipe')
      .exec(function (err, record) {
        if (err) return cb(err);
        // Compare against the recipe writer.
        if (! record || record.recipe.writtenBy !== claims.id) return cb('forbidden');
        RecipeIngredients.update({id}, update)
        .exec(function (err, updatedIngredient) {
          if (err) return cb(err);
          return cb(null, updatedIngredient);
        });
      });
    });
  },

  /*
   *  Deletes an ingredient from a recipe.
   *
   *  @param {int} id
   *  @param {string} jwt token
   *  @returns {boolean} if completed successfully.
   */
  deleteIngredient: function (id, token, cb) {
    // Grab the token claims.
    Tokens.getClaims(token, function (err, claims) {
      if (err) return cb(err);
      RecipeIngredients.findOne({id})
      .populate('recipe')
      .exec(function (err, record) {
        if (err) return cb(err);
        // Ensure that the user attempting to delete the ingredient owns the recipe.
        if (! record || record.recipe.writtenBy !== claims.id) return cb('forbidden');
        RecipeIngredients.destroy({id})
        .exec(function (err) {
          if (err) return cb(err);
          return cb(null, true);
        });
      });
    });
  }
};
