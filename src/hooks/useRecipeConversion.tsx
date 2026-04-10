import { useState, useEffect } from "react";
import { ConvertToType, OutputRecipeFormat, RecipeLineType, SelectedOptionsType } from "../types";
import { decimalToFraction, fractionUnits, getSourceUnit } from "../utils/formatting";
import { isEgg, isSpoonMeasure } from "../utils/ingredientRules";
import { parseRecipeText } from "../utils/parsing";

const parseURL = "https://api.spoonacular.com/recipes/parseIngredients";
const convertURL = "https://api.spoonacular.com/recipes/convert";
const apiKey: string = import.meta.env.VITE_APIKEY;

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

  // nonConvertedOutput deals with recipe lines that don't need to be converted from their original units
  const nonConvertedOutput = (recipeLine: RecipeLineType, targetAmount: number, targetUnit: string) => {
    const sourceAmount = recipeLine.amount;
    const convertedLine: OutputRecipeFormat = {
      answer: `${sourceAmount} ${recipeLine.unit} of ${recipeLine.name} are ${targetAmount} grams.`,
      sourceAmount: sourceAmount,
      sourceUnit: recipeLine.unit,
      targetAmount: targetAmount,
      targetUnit: targetUnit,
      type: "CONVERSION"
    };
    return convertedLine;
  };

  useEffect(() => {
    if (!converting || !pastedRecipe?.length) return;
    setConverting(false);
    // Erase any previous errors caused by failed requests
    setErrorMsg("");

    const recipeLinesToFetch = parseRecipeText(pastedRecipe);
    const requests = recipeLinesToFetch.map((recipeLine: string) => {
      return fetch(`${parseURL}?ingredientList=${recipeLine}&servings=1&includeNutrition=false&apiKey=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        }
      });
    });

    Promise.all(requests)
      .then(responses => {
        const errors = responses.filter(response => !response?.ok);
        if (errors.length) {
          throw errors.map(response => Error(response.statusText));
        }
        return Promise.all(responses.map(response => response.json()));
      })
      .then(parsedRecipeData => {
        const recipeDataRequests = parsedRecipeData.map(line => {
          if (!line[0].unitLong && !line[0].unitShort) {
            throw new Error("Each line must contain an ingredient and a unit");
          }
          const sourceAmount = line[0].amount;
          // To convert oz to grams there is no need to fetch as conversion is purely mathematical
          // Ensure response is in the same format as the parsed response for converted ingredients
          if (line[0].unitShort.toLowerCase() === "oz" && convertTo === "grams") {
            const targetAmount = Math.round(28.3495 * sourceAmount);
            return nonConvertedOutput(line[0], targetAmount, "grams");
            // If the user doesn't want to convert tsp/tbsp/eggs, leave them as they are
          } else if (
            (!selectedOptions.tsp && isSpoonMeasure(line[0].unitShort)) ||
            (!selectedOptions.eggs && isEgg(line[0].name))
          ) {
            return nonConvertedOutput(line[0], sourceAmount, line[0].unit);
            // If no unit was given and the ingredient is not eggs
          } else if (line[0].unit === "serving" && !line[0].name.includes("egg")) {
            return nonConvertedOutput(line[0], 0, "");
          } else {
            return fetch(
              `${convertURL}?ingredientName=${line[0].name}&sourceAmount=${line[0].amount}&sourceUnit=${line[0].unit}&targetUnit=${convertTo}&apiKey=${apiKey}`
            );
          }
        });

        return Promise.all(recipeDataRequests).then(responses => {
          // If the response is of type OutputRecipeFormat, it is already in its final format
          const json = responses.map((response: Response | OutputRecipeFormat) => {
            return "status" in response ? response.json() : response;
          });
          return Promise.all(json).then(outputRecipeData => ({
            parsedRecipeData,
            outputRecipeData
          }));
        });
      })
      .then(({ parsedRecipeData, outputRecipeData }) => {
        // Each successful request has an 'answer' attribute
        const failedRequests = outputRecipeData.filter(response => !response?.answer);
        if (failedRequests.length) {
          failedRequests.forEach(response => {
            throw new Error(response.message);
          });
        }

        const recipe: string[] = [];
        outputRecipeData.forEach((line, i) => {
          let originalRecipeLine = parsedRecipeData[i][0].original;
          const sourceUnit: string = getSourceUnit(line, parsedRecipeData[i][0]).toLowerCase();
          const sourceIndex = originalRecipeLine.indexOf(sourceUnit);

          // If the original line had a period after the unit (c. for cup or oz. for ounces, etc) remove the period
          if (originalRecipeLine[sourceIndex + sourceUnit.length] === ".") {
            originalRecipeLine = originalRecipeLine.split("");
            originalRecipeLine.splice(sourceIndex + sourceUnit.length, 1);
            originalRecipeLine = originalRecipeLine.join("");
          }

          let amountPlusUnit = line.targetAmount ? `${line.targetAmount} ${line.targetUnit}` : "";
          if (fractionUnits.includes(line.targetUnit)) {
            amountPlusUnit = decimalToFraction(line.targetAmount, line.targetUnit);
          } else if (line.targetUnit === "grams") {
            amountPlusUnit = `${Math.round(line.targetAmount)} ${line.targetUnit}`;
          }

          // If input was 3eggs, add a space so output is 44 grams eggs not 44 gramseggs
          const additionalSpace = originalRecipeLine[sourceIndex + sourceUnit.length] !== " " ? " " : "";
          const outputRecipeLine = originalRecipeLine.replace(sourceUnit, amountPlusUnit + additionalSpace);
          recipe.push(outputRecipeLine);
        });
        setOutputRecipe(recipe);
      })
      .catch(err => {
        console.log(err);
        if (err instanceof Error) {
          // Set an error message to prompt the user to update their recipe
          if (err.message.startsWith("Your daily points limit")) {
            setErrorMsg("The API limit has been reached. Please try again tomorrow.");
          } else {
            setErrorMsg(`Error: ${err.message}`);
          }
        }
      })
      .catch(errors => {
        errors.forEach((err: unknown) => console.log(err));
        setErrorMsg("An unknown error has occurred\n. There may be an issue with one of the ingredients.");
      });
  }, [converting, pastedRecipe, convertTo, selectedOptions.eggs, selectedOptions.tsp, setConverting, setErrorMsg]);

  return { outputRecipe };
};
