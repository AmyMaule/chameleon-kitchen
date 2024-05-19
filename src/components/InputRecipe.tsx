import { FunctionComponent, useRef } from 'react';

import ConversionOptions from './ConversionOptions';

type InputRecipeProps = {
  setPastedRecipe: Function,
  setConverting: Function,
  setSelectedOptions: Function
}

const InputRecipe = ({ setPastedRecipe, setConverting, setSelectedOptions }: InputRecipeProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSetRecipe: () => void = () => {
    if (textareaRef.current) {
      setPastedRecipe(textareaRef.current.value);
      setConverting(true);
    }
  }

  return (
    <>
      <h3 className="recipe-title">Paste or type your recipe below:</h3>
      <textarea className="recipe-container input-recipe-container" ref={textareaRef} />
      <ConversionOptions setSelectedOptions={setSelectedOptions} />
      <button className="btn-convert" onClick={handleSetRecipe}>
        <span>Convert!</span>
      </button>
    </>
  )
}

export default InputRecipe;
