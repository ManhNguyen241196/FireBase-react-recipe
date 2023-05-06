import { useEffect, useState } from "react";

let pra_getRecipeSelected;

function EditButton(props) {
  const [currentRecipe, setCurrentRecipe] = useState(null);

  useEffect(() => {
    if (currentRecipe) {
      props.getRecipeSelected(currentRecipe);
      setCurrentRecipe(null);
    } else {
      return;
    }
  }, [currentRecipe, props]);

  function handleInra() {
    if (currentRecipe) {
      props.getRecipeSelected(currentRecipe);

      //   pra_getRecipeSelected = nowEditRecipe[0];
    } else {
      handleEditRecipeClick(props.recipe.id);
    }
  }

  function handleEditRecipeClick(recipeId) {
    const nowEditRecipe = props.allRecipes.filter(
      (recipe) => recipe.id === recipeId
    );
    setCurrentRecipe((prevState) => (prevState = nowEditRecipe[0]));

    // if (currentRecipe) {
    //   props.getRecipeSelected(currentRecipe);

    //   console.log("/benphia button,", currentRecipe);
    //   pra_getRecipeSelected = nowEditRecipe[0];
    // }
  }

  return (
    <button
      type="button"
      onClick={() => {
        handleEditRecipeClick(props.recipe.id);
        handleInra();
      }}
      className="primary-button edit-button"
    >
      EDIT
    </button>
  );
}

export function getValue() {
  return pra_getRecipeSelected;
}

export default EditButton;
