const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Schema
var { Recipe, Ingredients } = require('./schema');

const app = express();

console.log(process.env.PORT);

// middleware
app.use(cors());
app.use(express.json()); // parse requests of content-type - application/json

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

mongoose
  .connect(
    'mongodb+srv://kyletseng:kI0uFSqRT6tcxso2@recipe-app-cluster.y73y5j2.mongodb.net/Recipe?retryWrites=true&w=majority&appName=recipe-app-cluster'
  )
  .then(() => {
    console.log('Successfully connect to MongoDB');

    // Post api/recipes - Create a new recipe
    // return - { "recipe" : {}, "ingredients": {}}
    app.post('/api/recipes', async (req, res) => {
      try {
        // Create ingredients document first
        const newIngredients = new Ingredients({ ingredients: req.body.ingredients });
        const savedIngredients = await newIngredients.save();

        // Create recipes document after to reference the ingredients document previously created
        let newRecipe = new Recipe(req.body);
        newRecipe.lastModified = Date.now();
        newRecipe.ingredients = savedIngredients.id;
        const savedRecipe = await newRecipe.save();

        // return
        res.json({
          recipeId: savedRecipe.id,
          name: savedRecipe.name,
          ingredients: savedIngredients.ingredients,
          directions: savedRecipe.directions,
          lastModified: savedRecipe.lastModified,
        });
      } catch (err) {
        console.error('Error creating Recipe: ', err);
        res.status(500).json({ err: 'Failed to create recipe' });
      }
    });

    // GET api/recipes - Get all recipes
    // return - { "recipe" : {}, "ingredients": {}}
    app.get('/api/recipes', async (req, res) => {
      try {
        const recipes = await Recipe.find();
        const recipesPromises = recipes.map(async (recipe) => {
          const ingredientsObject = await Ingredients.findById(recipe.ingredients[0]);
          return {
            recipeId: recipe.id,
            name: recipe.name,
            ingredients: ingredientsObject.ingredients,
            directions: recipe.directions,
            lastModified: recipe.lastModified,
          };
        });
        // return
        Promise.all(recipesPromises).then((result) => res.json(result));
      } catch (err) {
        console.error('Error finding recipes: ', err);
        res.status(500).json({ err: 'Failed to get recipes' });
      }
    });

    // PUT api/recipes/:id - Update a recipe
    app.put('/api/recipes/:id', async (req, res) => {
      console.log(req.body);
      console.log(req.params.id);
      try {
        const { name, ingredients, directions, lastModified } = req.body;
        // Update name, directions, lastModified
        const updatedRecipe = await Recipe.findByIdAndUpdate(
          req.params.id,
          { name, directions, lastModified, lastModified: Date.now() },
          { new: true }
        );
        // Take ingredients ID and find and update ingredients document in ingredients table
        const ingredientsId = updatedRecipe.ingredients;
        const updatedIngredients = await Ingredients.findByIdAndUpdate(ingredientsId, { ingredients }, { new: true });
        // return
        res.json({
          recipeId: updatedRecipe.id,
          name: updatedRecipe.name,
          ingredients: updatedIngredients.ingredients,
          directions: updatedRecipe.directions,
          lastModified: updatedRecipe.lastModified,
        });
      } catch (err) {
        console.error('Error updating a recipe: ', err);
        res.status(500).json({ err: 'Failed to create a new recipe' });
      }
    });

    // DELETE api/recipes/:id - Delete a recipe
    app.delete('/api/recipes/:id', async (req, res) => {
      try {
        const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
        const deletedIngredients = await Ingredients.findByIdAndDelete(deletedRecipe.ingredients);
        res.json({
          recipeId: deletedRecipe.id,
          name: deletedRecipe.name,
          ingredients: deletedIngredients.ingredients,
          directions: deletedRecipe.directions,
          lastModified: deletedRecipe.lastModified,
        });
      } catch (err) {
        console.error('Error deleting a recipe: ', err);
        res.status(500).json({ err: 'Failed to delete a recipe' });
      }
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error', err);
    process.exit();
  });
