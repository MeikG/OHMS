/**
 * RecipeInstructions.js
 *
 * @description :: Step-by-step instructions for each recipe.
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
    ingredients: {
      collection: 'InstructionIngredients',
      via: 'ingredient'
    },
    time: 'int',
    description: 'string'
  }
};

