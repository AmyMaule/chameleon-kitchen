import { useEffect, useRef, useState } from "react";

import RecipeTextarea from "../RecipeTextArea";
import OutputRecipeContainer from "../OutputRecipeContainer";
import RecipeConvertBtn from "../RecipeConvertBtn";
import ErrorMsg from "../ErrorMsg";
import TinSelection from "./TinSelection";
import { TinConfig } from "../../types";
import { tinShapeOptions, tinSizeOptions } from "../../utils/constants";

const TinConversion = () => {
  const [converting, setConverting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [outputRecipe, setOutputRecipe] = useState<string[]>([""]);
  const [pastedRecipe, setPastedRecipe] = useState("");
  const [fromTin, setFromTin] = useState<TinConfig>({
    shape: tinShapeOptions[0],
    size: tinSizeOptions[0]
  });
  const [toTin, setToTin] = useState<TinConfig>({
    shape: tinShapeOptions[0],
    size: tinSizeOptions[0]
  });
  const outputRecipeRef = useRef<HTMLDivElement>(null);

  const handleSetRecipe = () => {
    if (pastedRecipe) {
      console.log("From", fromTin.shape.label, "to", toTin.shape.label);
      console.log("From", fromTin.size?.label, "to", toTin.size?.label);
      setConverting(true);
    } else {
      setErrorMsg("Enter a recipe to get started!");
    }
  };

  useEffect(() => {
    if (!converting) return;
    setConverting(false);

    const output = pastedRecipe.split("\n").map(line => {
      // call API to parse line to get amount
      // manually convert amount
      // return new amount + ingredient
      return line;
    });
    setOutputRecipe(output);
  }, [converting, pastedRecipe]);

  return (
    <>
      <div className="tin-size-conversion-container">
        <h4 className="tin-size-title">Convert a recipe...</h4>
        <div className="tin-size-selection-container">
          <TinSelection
            label="From this tin..."
            tin={fromTin}
            onChange={patch => setFromTin(prev => ({ ...prev, ...patch }))}
          />
          <TinSelection
            label="...to this tin"
            tin={toTin}
            onChange={patch => setToTin(prev => ({ ...prev, ...patch }))}
          />
        </div>
      </div>

      <RecipeTextarea value={pastedRecipe} onChange={e => setPastedRecipe(e.target.value)} />
      <RecipeConvertBtn converting={converting} handleSetRecipe={handleSetRecipe} />
      {errorMsg && <ErrorMsg message={errorMsg} />}
      <OutputRecipeContainer outputRecipe={outputRecipe} outputRecipeRef={outputRecipeRef} />
    </>
  );
};

export default TinConversion;
