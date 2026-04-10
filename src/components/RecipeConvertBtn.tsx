type RecipeConvertBtnProps = {
  converting: boolean;
  handleSetRecipe: () => void;
};

const RecipeConvertBtn = ({ converting, handleSetRecipe }: RecipeConvertBtnProps) => {
  return (
    <button className="btn-convert" onClick={handleSetRecipe} disabled={converting}>
      <span>Convert!</span>
    </button>
  );
};

export default RecipeConvertBtn;
