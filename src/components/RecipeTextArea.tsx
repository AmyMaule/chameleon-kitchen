import React from "react";

type RecipeTextareaProps = {
  textareaRef: React.Ref<HTMLTextAreaElement>;
};

const RecipeTextarea = ({ textareaRef }: RecipeTextareaProps) => {
  return (
    <>
      <h3 className="recipe-title">Paste or type your recipe below:</h3>
      <textarea className="recipe-container input-recipe-container" ref={textareaRef} />
    </>
  );
};

export default RecipeTextarea;
