import { useState, useEffect } from "react";
import { ConvertToType, SelectedOptionsType } from "../types";
import { buildOutputRecipe } from "../utils/formatting";
import { parseRecipeText } from "../utils/parsing";
import { convertIngredients } from "../api/convertApi";
import { parseIngredients } from "../api/parseApi";

type UseRecipeConversionProps = {
  converting: boolean;
  pastedRecipe: string;
  convertTo: ConvertToType;
  selectedOptions: SelectedOptionsType;
  setConverting: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
};

export const useRecipeConversion = ({
  converting,
  pastedRecipe,
  convertTo,
  selectedOptions,
  setConverting,
  setErrorMsg
}: UseRecipeConversionProps) => {
  const [outputRecipe, setOutputRecipe] = useState<string[]>([]);

  useEffect(() => {
    if (!converting || !pastedRecipe?.length) return;
    setConverting(false);
    // Erase any previous errors caused by failed requests
    setErrorMsg("");

    const recipeLinesToFetch = parseRecipeText(pastedRecipe);

    parseIngredients(recipeLinesToFetch)
      .then(parsedRecipeData => {
        return convertIngredients(parsedRecipeData, convertTo, selectedOptions);
      })
      .then(({ parsedRecipeData, outputRecipeData }) => {
        // Each successful request has an 'answer' attribute
        const failedRequest = outputRecipeData.find(response => !response?.answer);
        if (failedRequest) {
          throw new Error(failedRequest.message);
        }

        const recipe = buildOutputRecipe(outputRecipeData, parsedRecipeData);
        setOutputRecipe(recipe);
      })
      .catch((err: unknown) => {
        console.log(err);
        // Set an error message to prompt the user to update their recipe
        const message = err instanceof Error ? err.message : "An unknown error occurred";

        if (message.startsWith("Your daily points limit")) {
          setErrorMsg("The API limit has been reached. Please try again tomorrow.");
        } else {
          setErrorMsg(`Error: ${message}`);
        }
      });
  }, [converting, pastedRecipe, convertTo, selectedOptions, setConverting, setErrorMsg]);

  return { outputRecipe };
};
