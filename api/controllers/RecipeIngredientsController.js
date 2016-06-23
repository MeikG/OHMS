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
    var recipeId = req.param('recipeid');
    var amount = parseInt(req.param('amount'));
    var measurement = req.param('measurement') || null;
    var name = req.param('name');
    var token = req.cookies[sails.config.jwt.cookieName];
    // Only accept properly formed requests.
    if (! recipeId || ! amount || ! name) return res.badRequest();
    Recipes.findRecipes(recipeId, function (err, recipe) {
      if (err) res.serverError(err);
      // If the recipe doesn't exist, return 404.
      if (! recipe) return res.notFound();
      RecipeIngredients.createIngredient(recipeId, amount, measurement, name, token, function (err, ingredient) {
        if (err) return res.serverError(err);
        if (! ingredient) return res.forbidden();
        return res.ok(ingredient);
      });
    });
  },

  /*
   * Edit an ingredient.
   */
  editIngredient: function (req, res) {
    var token = req.cookies[sails.config.jwt.cookieName];
    var id = req.param('ingredientid');
    RecipeIngredients.findOne(id, function (err, ingredient) {
      if (err) return res.serverError(err);
      if (! ingredient) return res.notFound();
      // Update the ingredient with the new information.
      newIngredient = {
        amount: parseInt(req.param('amount')) || 0,
        measurement: req.param('measurement') || null,
        name: req.param('name') || null
      };
      RecipeIngredients.editIngredient(id, newIngredient, token, function (err, updatedIngredient) {
        if (err) return res.negotiate(err);
        if (! updatedIngredient) return res.forbidden();
        return res.ok(updatedIngredient);
      });
    });
  },
};
