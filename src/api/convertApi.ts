import { isEgg, isSpoonMeasure } from "../utils/ingredientRules";
import { ConvertToType, OutputRecipeFormat, SelectedOptionsType, ParsedRecipeFormat, RecipeLineType } from "../types";

const convertURL = "https://api.spoonacular.com/recipes/convert";
const apiKey: string = import.meta.env.VITE_APIKEY;

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

export const convertIngredients = async (
  parsedRecipeData: ParsedRecipeFormat[][],
  convertTo: ConvertToType,
  selectedOptions: SelectedOptionsType
) => {
  const recipeDataRequests = parsedRecipeData.map(lineRaw => {
    const line = lineRaw[0];
    const sourceAmount = line.amount;

    // To convert oz to grams there is no need to fetch as conversion is purely mathematical
    // Ensure response is in the same format as the parsed response for converted ingredients
    if (line?.unitShort.toLowerCase() === "oz" && convertTo === "grams") {
      const targetAmount = Math.round(28.3495 * sourceAmount);
      return nonConvertedOutput(line, targetAmount, "grams");
      // If the user doesn't want to convert tsp/tbsp/eggs, leave them as they are
    } else if (
      (!selectedOptions.tsp && isSpoonMeasure(line?.unitShort)) ||
      (!selectedOptions.eggs && isEgg(line.name))
    ) {
      return nonConvertedOutput(line, sourceAmount, line.unit);
    } else if (line.unit === "serving" && !line.name.includes("egg")) {
      return nonConvertedOutput(line, 0, "");
    } else {
      return fetch(
        `${convertURL}?ingredientName=${line.name}&sourceAmount=${line.amount}&sourceUnit=${line.unit}&targetUnit=${convertTo}&apiKey=${apiKey}`
      );
    }
  });

  const responses = await Promise.all(recipeDataRequests);

  const json = responses.map((response: Response | OutputRecipeFormat) => {
    return response instanceof Response ? response.json() : response;
  });

  const outputRecipeData = await Promise.all(json);

  return { parsedRecipeData, outputRecipeData };
};
