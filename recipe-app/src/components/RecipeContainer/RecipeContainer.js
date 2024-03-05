import React, { useEffect, useState } from 'react';
import uniqid from 'uniqid';

// MUI
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemButton from '@mui/material/ListItemButton';
import Button from '@mui/material/Button';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

// Components
import AddRecipeModal from '../AddRecipeModal/AddRecipeModal';
import RecipeDetails from '../RecipeDetails/RecipeDetails';

// Styles
import './style.css';

function RecipeContainer({ ...props }) {
  const [recipes, setRecipes] = useState([]);
  // Used for deleting
  const [selectedRecipe, setSelectedRecipe] = useState({});
  const [isRecipeDetailsModalVisible, setIsRecipeDetailsModalVisible] = useState(false);
  const [isAddRecipeModalVisible, setIsAddRecipeModalVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

  const API_URL = 'http://localhost:8080/api/recipes';

  /* -------------------------------- useEffect ------------------------------- */
  useEffect(() => {
    getRecipes();
  }, []);

  // debug
  useEffect(() => {
    console.log(recipes);
  }, [recipes]);

  useEffect(() => {
    console.log('selectedRecipe', selectedRecipe);
  }, [selectedRecipe]);

  /* -------------------------------- Helpers ------------------------------- */
  // Retrieves recipes array from localstorage and update recipes state
  function getRecipes() {
    fetch(API_URL, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
        setRecipes(data);
      });
  }

  // Add new recipe to the recipeArray in localstorage
  // recipe - { name, ingredients, directions }
  function addRecipe(recipe) {
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe),
    }).then(() => getRecipes());
  }

  function deleteRecipe(recipe) {
    // Find recipe in the array and filter it out
    fetch(`${API_URL}/${recipe.recipeId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    }).then(() => getRecipes());
  }

  function updateRecipe(recipe) {
    fetch(`${API_URL}/${recipe.recipeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe),
    }).then(() => getRecipes());
  }

  return (
    <div className="recipe-container">
      <List dense={false}>
        {recipes.map((recipe) => {
          return (
            <ListItem
              disablePadding
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => {
                    setSelectedRecipe(recipe);
                    setIsDeleteDialogVisible(true);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemButton
                onClick={() => {
                  setSelectedRecipe(recipe);
                  setIsRecipeDetailsModalVisible(true);
                }}
              >
                <ListItemText primary={recipe.name} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Button variant="contained" onClick={() => setIsAddRecipeModalVisible(true)}>
        Add Recipe
      </Button>

      {/* Recipe details compoonent */}
      <RecipeDetails
        visible={isRecipeDetailsModalVisible}
        setVisible={(visible) => setIsRecipeDetailsModalVisible(visible)}
        recipe={selectedRecipe}
        updateRecipe={(recipe) => updateRecipe(recipe)}
      />

      {/* Add recipe component */}
      <AddRecipeModal
        visible={isAddRecipeModalVisible}
        setVisible={(visible) => setIsAddRecipeModalVisible(visible)}
        addRecipe={(recipe) => addRecipe(recipe)}
      />

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogVisible} onClose={() => setIsDeleteDialogVisible(false)}>
        <DialogTitle>Would you like to delete {selectedRecipe.name}?</DialogTitle>
        <DialogActions>
          <Button autoFocus onClick={() => setIsDeleteDialogVisible(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setIsDeleteDialogVisible(false);
              deleteRecipe(selectedRecipe);
            }}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default RecipeContainer;
