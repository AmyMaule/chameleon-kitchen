import React from "react";

type RecipeTextareaProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const RecipeTextarea = ({ value, onChange }: RecipeTextareaProps) => {
  return (
    <>
      <h3 className="recipe-title">Paste or type your recipe below:</h3>
      <textarea className="recipe-container input-recipe-container" value={value} onChange={onChange} />
    </>
  );
};

export default RecipeTextarea;
