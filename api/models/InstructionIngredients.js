/**
 * InstructionInstructions.js
 *
 * @description :: Link ingredients to a recipe instruction.
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
    instruction: {
      model: 'RecipeInstructions'
    },
    ingredient: {
      collection: 'RecipeIngredients',
      via: 'id'
    }
  }
};

