import { useRef } from 'react';

import { 
  ConvertToType,
  SelectedOptionsType
} from '../../types';

import ConversionOptions from './ConversionOptions';
import ConversionUnit from './ConversionUnit';
import RecipeTextarea from '../RecipeTextArea';

type InputRecipeProps = {
  converting: boolean,
  convertTo: ConvertToType,
  setPastedRecipe: React.Dispatch<React.SetStateAction<string>>,
  setConverting: React.Dispatch<React.SetStateAction<boolean>>,
  setConvertTo: React.Dispatch<React.SetStateAction<ConvertToType>>,
  setSelectedOptions: React.Dispatch<React.SetStateAction<SelectedOptionsType>>
}

const InputRecipe = ({ 
  converting, 
  convertTo, 
  setPastedRecipe, 
  setConverting, 
  setConvertTo, 
  setSelectedOptions 
}: InputRecipeProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSetRecipe: () => void = () => {
    if (textareaRef.current && textareaRef.current.value) {
      setPastedRecipe(textareaRef.current.value);
      setConverting(true);
    }
  }

  return (
    <>
      <RecipeTextarea textareaRef={textareaRef} />
      <ConversionOptions setSelectedOptions={setSelectedOptions} />
      <div className="conversion-units-container">
        <div className="conversion-units-text">Converting into</div>
        <ConversionUnit 
          convertTo={convertTo}
          setConvertTo={setConvertTo}
        />
      </div>
      <button className="btn-convert" onClick={handleSetRecipe} disabled={converting}>
        <span>Convert!</span>
      </button>
    </>
  )
}

export default InputRecipe;
