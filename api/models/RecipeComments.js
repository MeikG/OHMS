/**
 * RecipeComments.js
 *
 * @description :: Comments made by users on recipes.
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
      model: 'Recipes',
      unique: true
    },
    writtenBy: {
      model: 'Users',
      unique: true
    },
    comment: 'string'
  }
};
