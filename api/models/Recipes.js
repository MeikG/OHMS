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
      model: 'Users'
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
      Recipes.findOne({recipeName, writtenBy: claims.id}).exec(function (err, duplicate) {
        if (err) return cb(err);
        if (duplicate) return cb(400);
        Recipes.create({recipeName, recipeDescription, writtenBy: claims.id}).exec(function (err, recipe) {
          if (err) return cb(err);
          return cb(null, recipe);
        });
      });
    });
  },

  /*
   *  Returns either all recipes if user is null, or a specific recipe.
   *
   *  @param {int} User id or null.
   *  @returns {array} Array of all recipes in the system.
   */
  findRecipes(id, cb) {
    // If null is provided, search for all recipes.
    var search = (id === null? {} : {id});

    Recipes.find(search)
    .populate('writtenBy')
    .exec(function (err, recipes) {
      if (err) return cb(err);
      recipes.forEach(function (recipe) {
        delete recipe.writtenBy.password;
        delete recipe.writtenBy.createdAt;
        delete recipe.writtenBy.updatedAt;
      });
      if (recipes.length === 0) return cb(404);
      if (id !== null) return cb(null, recipes[0]);
      return cb(null, recipes);
    });
  },

  /*
   *  Find all recipes made by a specific user.
   *
   *  @param {int} user id
   *  @returns {array} Array of recipes.
   */
  findMine(id, cb) {
    Recipes.find({writtenBy: id})
    .populate('writtenBy')
    .exec(function (err, recipes) {
      if (err) return cb(err);
      recipes.forEach(function (recipe) {
        delete recipe.writtenBy.password;
        delete recipe.writtenBy.createdAt;
        delete recipe.writtenBy.updatedAt;
      });
      return cb(null, recipes);
    });
  }
};
