type OutputRecipeContainerProps = {
  outputRecipe: string[]
  outputRecipeRef: React.Ref<HTMLDivElement>
}

const OutputRecipeContainer = ({ outputRecipe, outputRecipeRef }: OutputRecipeContainerProps) => {
  return (
    <div className="output-recipe-section-container" ref={outputRecipeRef}>
      <h3 className="recipe-title">Your converted recipe:</h3>

      <div className="recipe-container output-recipe-container">
        {outputRecipe.length ? (
          <div className="output-recipe">
            {outputRecipe.map((line, i) => (
              <div key={line + i}>{line}</div>
            ))}
          </div>
        ) : (
          <div>
            Paste or type a recipe into the box above to get started!
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputRecipeContainer;
