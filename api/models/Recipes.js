/**
 * Recipes.js
 *
 * @description :: A model for the recipes available to users.
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
    recipeName: 'string',
    recipeDescription: 'string',
    writtenBy: {
      model: 'Users',
      unique: true
    },
    ingredients: {
      collection: 'RecipeIngredients',
      via: 'recipe'
    },
    instructions: {
      collection: 'RecipeInstructions',
      via: 'recipe'
    }
  }
};
