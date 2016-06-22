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
  },

  /*
   *  Create a new empty recipe.
   *
   *  @param  recipeName        {string}
   *          recipeDescription {string}
   *
   *  @returns {object} The newly created recipe.
   */
  createRecipe(recipeName, recipeDescription, token, cb) {
    // Retrieve the user from the JWT.
    Tokens.getClaims(token, function (err, claims) {
      if (err) return cb(err);
      Recipes.create({recipeName, recipeDescription, writtenBy: claims.id}).exec(function(err, recipe) {
        if (err) return cb(err);
        return cb(null, recipe);
      });
    });
  },

};
