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
   *  @returns {object} Recipe Ingredient
   */
  createIngredient: function (id, amount, measurement, name, cb) {
    Recipes.findOne({id}).exec(function (err, exists) {
      if (err) return cb(err);
      if (! exists) return cb(404);
      RecipeIngredients.create({recipe: id, amount, measurement, name}).exec(function (err, ingredient) {
        if (err) return cb(err);
        return cb(null, ingredient);
      });
    });
  },

  /*
   *  Updates an ingredient in the database.
   *
   *  @param {int} id
   *  @param {object} ingredient
   *  @returns {object} updated ingredient.
   */
  editIngredient: function (id, ingredient, cb) {
    RecipeIngredients.update({id}, ingredient)
    .exec(function (err, updatedIngredient) {
      if (err) return cb(err);
      return cb(null, updatedIngredient);
    });
  }
};
