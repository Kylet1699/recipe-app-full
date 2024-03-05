import React, { useEffect, useState } from 'react';

// MUI
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

// styles
import './style.css';

function AddRecipeModal({ ...props }) {
  const [recipe, setRecipe] = useState({ name: '', ingredients: '', directions: '' });
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true);

  useEffect(() => {
    if (
      recipe.name?.trim().length !== 0 &&
      recipe.ingredients?.trim().length !== 0 &&
      recipe.directions?.trim().length !== 0
    )
      setIsAddButtonDisabled(false);
  }, [recipe]);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={props.visible}
      onClose={() => props.setVisible(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          New Recipe
        </Typography>

        <TextField
          id="recipe-name"
          label="Name"
          variant="outlined"
          className="input-box"
          onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
        />
        <TextField
          id="recipe-ingredients"
          label="Ingredients"
          variant="outlined"
          multiline
          maxRows={4}
          className="input-box"
          onChange={(e) => setRecipe({ ...recipe, ingredients: e.target.value })}
        />
        <TextField
          id="recipe-directions"
          label="Directions"
          variant="outlined"
          multiline
          maxRows={4}
          className="input-box"
          onChange={(e) => setRecipe({ ...recipe, directions: e.target.value })}
        />

        <div className="action-buttons">
          <Button
            onClick={() => {
              props.addRecipe(recipe);
              props.setVisible(false);
            }}
            disabled={isAddButtonDisabled}
          >
            Add
          </Button>
          <Button onClick={() => props.setVisible(false)}>Cancel</Button>
        </div>
      </Box>
    </Modal>
  );
}

export default AddRecipeModal;
