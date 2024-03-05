const mongoose = require('mongoose');

const { Schema, model } = mongoose;

// Recipe
const RecipeSchema = new mongoose.Schema({
  name: String,
  ingredients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredients',
    },
  ],
  directions: String,
  lastModified: Date,
});

// Ingredients
const IngredientsSchema = new mongoose.Schema({
  ingredients: String,
});

const Recipe = mongoose.model('Recipes', RecipeSchema);
const Ingredients = mongoose.model('Ingredients', IngredientsSchema);

module.exports = { Recipe, Ingredients };
