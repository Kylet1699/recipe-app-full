import React, { useEffect, useState } from 'react';

// MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// css
import './style.css';

function RecipeDetails({ ...props }) {
  const [recipe, setRecipe] = useState(props.recipe);
  const [isSaveBtnDisabled, setIsSaveBtnDisabled] = useState(true);

  useEffect(() => {
    setRecipe(props.recipe);
    setIsSaveBtnDisabled(true);
  }, [props.recipe]);

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
    <div>
      <Modal open={props.visible} onClose={() => props.setVisible(false)}>
        <Box sx={style}>
          <TextField
            id="recipe-name"
            label="Name"
            variant="outlined"
            className="input-box"
            defaultValue={props.recipe.name}
            onChange={(e) => {
              setIsSaveBtnDisabled(false);
              setRecipe({ ...recipe, name: e.target.value });
            }}
          />
          <TextField
            id="recipe-ingredients"
            label="Ingredients"
            variant="outlined"
            multiline
            maxRows={4}
            minRows={4}
            defaultValue={props.recipe.ingredients}
            className="input-box"
            onChange={(e) => {
              setIsSaveBtnDisabled(false);
              setRecipe({ ...recipe, ingredients: e.target.value });
            }}
          />

          <TextField
            id="recipe-directions"
            label="Directions"
            variant="outlined"
            multiline
            maxRows={4}
            minRows={4}
            defaultValue={props.recipe.directions}
            className="input-box"
            onChange={(e) => {
              setIsSaveBtnDisabled(false);
              setRecipe({ ...recipe, directions: e.target.value });
            }}
          />
          <Typography sx={{ mb: '0.5rem', mt: '0.5rem' }}>
            Last Modified: {props.recipe.lastModified?.toLocaleString().replace('Z', ' UTC').replace('T', ' ')}
          </Typography>
          {/* Buttons */}
          <div className="action-buttons">
            <Button
              onClick={() => {
                props.updateRecipe(recipe);
                props.setVisible(false);
              }}
              disabled={isSaveBtnDisabled}
            >
              Update
            </Button>
            <Button onClick={() => props.setVisible(false)}>Close</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default RecipeDetails;
