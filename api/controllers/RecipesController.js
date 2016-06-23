/**
 * RecipesController.js
 *
 * @description :: View, add, edit, delete and search for recipes.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  /*
   * Create a new recipe.
   */
  createRecipe: function (req, res) {
    var recipeName = req.param('recipeName') || '';
    var recipeDescription = req.param('recipeDescription') || '';
    var token = req.cookies[sails.config.jwt.cookieName];
    if (recipeName.length < 5) return res.badRequest();
    Recipes.createRecipe(recipeName, recipeDescription, token, function (err, recipe) {
      if (err) switch (err) {
        default:
          return res.serverError(err);
        case 400:
          return res.badRequest(err);
      }
      return res.ok(recipe);
    });
  },

  /*
   * Find all recipes.
   */
  find: function (req, res) {
    Recipes.findRecipes(null, function (err, recipes) {
      if (err) return res.serverError(err);
      return res.ok(recipes);
    });
  },

  /*
   * Find all recipes for a user.
   */
  findByUser: function (req, res) {
    var token = req.cookies[sails.config.jwt.cookieName];
    // Get the claims made by the token, and find all recipes with that id.
    Tokens.getClaims(token, function (err, claims) {
      if (err) return res.serverError(err);
      var id = req.param('id') || claims.id;
      if (id != parseInt(id)) return res.badRequest();
      Recipes.findMine(id, function (err, recipes) {
        if (err) switch (err) {
          default:
            return res.serverError(err);
          case 404:
            return res.notFound();
        }
        if (recipes.length === 0) return res.notFound();
        return res.ok(recipes);
      });
    });
  },

  /*
   * Find a specific recipe.
   */
  findOne: function (req, res) {
    var id = req.param('id');
    if (id != parseInt(id)) return res.badRequest();
    Recipes.findRecipes(id, function (err, recipe) {
      if (err) switch (err) {
        default:
          return res.serverError(err);
        case 404:
          return res.notFound();
      }
      if (! recipe) return res.notFound();
      return res.ok(recipe);
    });
  }
};
