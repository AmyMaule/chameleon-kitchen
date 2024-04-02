import React, { useRef } from 'react';

const InputRecipe = ({ setPastedRecipe }) => {
  const textareaRef = useRef();

  const handleSetRecipe = () => {
    if (textareaRef.current) {
      setPastedRecipe(textareaRef.current.value);
    }
  }

  return (
    <>
      <h3 className="recipe-title">Paste or type your recipe below:</h3>
      <textarea className="recipe-container input-recipe-container" ref={textareaRef} />
      <button className="btn-convert" onClick={handleSetRecipe}>Convert!</button>
    </>
  )
}

export default InputRecipe;
