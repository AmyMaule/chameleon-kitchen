import { useState } from "react";
import InputRecipe from "./InputRecipe";
import OutputRecipe from "./OutputRecipe";
import { ConvertToType, SelectedOptionsType } from "../../types";


const UnitConversion = () => {
  const [converting, setConverting] = useState(false);
  const [convertTo, setConvertTo] = useState<ConvertToType>("grams");
  const [errorMsg, setErrorMsg] = useState("");
  const [pastedRecipe, setPastedRecipe] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptionsType>({
    eggs: false,
    tsp: false
  });

  return (
    <>
      <InputRecipe
        converting={converting}
        convertTo={convertTo}
        setPastedRecipe={setPastedRecipe} 
        setSelectedOptions={setSelectedOptions}
        setConverting={setConverting}
        setConvertTo={setConvertTo}
      />

      {errorMsg && 
        <div className="recipe-error-container">
          <h6 className="recipe-error-text">
            Oops! An error has occurred:{"\n"}
            {errorMsg}
          </h6>
        </div>
      }
      
      <OutputRecipe 
        converting={converting}
        convertTo={convertTo}
        pastedRecipe={pastedRecipe} 
        selectedOptions={selectedOptions}
        setConverting={setConverting}
        setErrorMsg={setErrorMsg}
      />
    </>
  )
}

export default UnitConversion;
