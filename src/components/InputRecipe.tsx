import { useRef } from 'react';

import { 
  ConvertToType,
  SelectedOptionsType
} from '../types';

import ConversionOptions from './ConversionOptions';
import ConversionUnit from './ConversionUnit';

type InputRecipeProps = {
  convertTo: ConvertToType
  setPastedRecipe: React.Dispatch<React.SetStateAction<string>>,
  setConverting: React.Dispatch<React.SetStateAction<boolean>>,
  setConvertTo: React.Dispatch<React.SetStateAction<ConvertToType>>,
  setSelectedOptions: React.Dispatch<React.SetStateAction<SelectedOptionsType>>
}

const InputRecipe = ({ convertTo, setPastedRecipe, setConverting, setConvertTo, setSelectedOptions }: InputRecipeProps) => {
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
      <div className="conversion-units-container">
        <div className="conversion-units-text">Converting into</div>
        <ConversionUnit 
          convertTo={convertTo}
          setConvertTo={setConvertTo}
        />
      </div>
      <button className="btn-convert" onClick={handleSetRecipe}>
        <span>Convert!</span>
      </button>
    </>
  )
}

export default InputRecipe;
