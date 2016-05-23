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
      model: 'Recipe'
    },
    amount: 'int',
    measurement: 'string',
    ingredient: 'string'
  }
};

