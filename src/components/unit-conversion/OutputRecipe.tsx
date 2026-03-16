import { useEffect, useRef } from "react";

import { useRecipeConversion } from "../../hooks/useRecipeConversion";
import OutputRecipeContainer from "../OutputRecipeContainer";

import {
  ConvertToType,
  SelectedOptionsType,
} from "../../types";

type OutputRecipeProps = {
  converting: boolean,
  convertTo: ConvertToType,
  pastedRecipe: string,
  selectedOptions: SelectedOptionsType,
  setConverting: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>
}

const OutputRecipe = ({ converting, convertTo, pastedRecipe, selectedOptions, setErrorMsg, setConverting }: OutputRecipeProps) => {
  const outputRecipeRef = useRef<HTMLDivElement>(null);
  const { outputRecipe } = useRecipeConversion({
    converting,
    pastedRecipe,
    convertTo,
    selectedOptions,
    setConverting,
    setErrorMsg
  });

  // scroll to output container once conversion is complete
  useEffect(() => {
    if (!outputRecipe.length) return;

    if (outputRecipeRef.current) {
      outputRecipeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }, [outputRecipe]);

  return (
    <OutputRecipeContainer
      outputRecipe={outputRecipe}
      outputRecipeRef={outputRecipeRef}
    />
  )
}

export default OutputRecipe;
