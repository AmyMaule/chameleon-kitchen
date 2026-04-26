import { useEffect, useRef, useState } from "react";

import RecipeTextarea from "../RecipeTextArea";
import OutputRecipeContainer from "../OutputRecipeContainer";
import RecipeConvertBtn from "../RecipeConvertBtn";
import ErrorMsg from "../ErrorMsg";
import TinSizeSelection from "./TinSizeSelection";
import { TinSizeOption } from "../../types";

const TinConversion = () => {
  const [converting, setConverting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [outputRecipe, setOutputRecipe] = useState<string[]>([""]);
  const [pastedRecipe, setPastedRecipe] = useState("");
  const [fromTinSize, setFromTinSize] = useState<TinSizeOption | null>(null);
  const [toTinSize, setToTinSize] = useState<TinSizeOption | null>(null);
  const outputRecipeRef = useRef<HTMLDivElement>(null);

  const handleSetRecipe: () => void = () => {
    if (pastedRecipe) {
      console.log("From tin", fromTinSize?.label, "to tin:", toTinSize?.label);
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
      <TinSizeSelection
        fromTinSize={fromTinSize}
        toTinSize={toTinSize}
        setFromTinSize={setFromTinSize}
        setToTinSize={setToTinSize}
      />
      <RecipeTextarea value={pastedRecipe} onChange={e => setPastedRecipe(e.target.value)} />
      <RecipeConvertBtn converting={converting} handleSetRecipe={handleSetRecipe} />
      {errorMsg && <ErrorMsg message={errorMsg} />}
      <OutputRecipeContainer outputRecipe={outputRecipe} outputRecipeRef={outputRecipeRef} />
    </>
  );
};

export default TinConversion;
