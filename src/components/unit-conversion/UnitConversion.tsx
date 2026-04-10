import { useState } from "react";
import ConversionOptions from "./ConversionOptions";
import ConversionUnit from "./ConversionUnit";
import OutputRecipe from "./OutputRecipe";
import { ConvertToType, SelectedOptionsType } from "../../types";
import RecipeTextarea from "../RecipeTextArea";
import RecipeConvertBtn from "../RecipeConvertBtn";
import ErrorMsg from "../ErrorMsg";

const UnitConversion = () => {
  const [converting, setConverting] = useState(false);
  const [convertTo, setConvertTo] = useState<ConvertToType>("grams");
  const [errorMsg, setErrorMsg] = useState("");
  const [pastedRecipe, setPastedRecipe] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptionsType>({
    eggs: false,
    tsp: false
  });

  const handleSetRecipe: () => void = () => {
    if (pastedRecipe) {
      setConverting(true);
    } else {
      setErrorMsg("Enter a recipe to get started!");
    }
  };

  return (
    <>
      <RecipeTextarea value={pastedRecipe} onChange={e => setPastedRecipe(e.target.value)} />
      <ConversionOptions setSelectedOptions={setSelectedOptions} />
      <div className="conversion-units-container">
        <div className="conversion-units-text">Converting into</div>
        <ConversionUnit convertTo={convertTo} setConvertTo={setConvertTo} />
      </div>
      <RecipeConvertBtn converting={converting} handleSetRecipe={handleSetRecipe} />

      {errorMsg && <ErrorMsg message={errorMsg} />}

      <OutputRecipe
        converting={converting}
        convertTo={convertTo}
        pastedRecipe={pastedRecipe}
        selectedOptions={selectedOptions}
        setConverting={setConverting}
        setErrorMsg={setErrorMsg}
      />
    </>
  );
};

export default UnitConversion;
