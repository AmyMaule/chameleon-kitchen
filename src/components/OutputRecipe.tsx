import { useState, useEffect, useRef } from "react";

import {
  ConvertToType,
  OutputRecipeFormat,
  RecipeLineType, 
  SelectedOptionsType,
} from "../types";

import { 
  decimalToFraction,
  fractionUnits,
  isEgg,
  isSpoonMeasure
} from "../utilities";

type OutputRecipeProps = {
  converting: boolean,
  convertTo: ConvertToType,
  pastedRecipe: string,
  selectedOptions: SelectedOptionsType,
  setConverting: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>
}

const OutputRecipe = ({ converting, convertTo, pastedRecipe, selectedOptions, setErrorMsg, setConverting }: OutputRecipeProps) => {
  const [outputRecipe, setOutputRecipe] = useState<string[]>([]);
  const convertURL = "https://api.spoonacular.com/recipes/convert";
  const parseURL = "https://api.spoonacular.com/recipes/parseIngredients";
  const apiKey: string = import.meta.env.VITE_APIKEY;
  const outputRecipeRef = useRef<HTMLDivElement>(null);
  
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
    }
    return convertedLine;
  }

  const getSourceUnit = (originalRecipeLine: string, line: OutputRecipeFormat): string => {
    // If the original recipe was typed with no space between the amount and unit (e.g. 1cup) ensure this is replaced correctly
    const spaceChar = originalRecipeLine.includes(`${line.sourceAmount} ${line.sourceUnit}`) ? " " : "";

    // Replace the original measurement with the converted gram amounts - some lines don't have sourceUnits (e.g. 2 eggs)
    return line.sourceUnit 
      ? `${line.sourceAmount}${spaceChar}${line.sourceUnit}` 
      : line.sourceAmount.toString();
  }

  useEffect(() => {
    if (!converting || !pastedRecipe?.length) return;
    setConverting(false);

    const recipeLinesToFetch = pastedRecipe
      .split("\n")
      .map((row: string) => {
        // If the first character of the line is not a number, slice from the first num
        if (isNaN(Number(row[0]))) {
          const rowArr = row.split("");
          const firstNum = rowArr.findIndex(char => !isNaN(Number(char)) && char !== " ");
          return row.slice(firstNum).trim();
        }
        return row;
      })
      .filter((row: string) => row)
      // replace any unicode fraction characters with normalized strings
      .map((row: string) => row.normalize("NFKD").replaceAll("▢", ""))
      .map((row: string) => {
        const slashPresent: boolean = row.indexOf("\u2044") !== -1 || row.indexOf("/") !== -1;
        
        // Highly unlikely there will ever be two digits as the numerator in a recipe - deal with this edge case if it ever crops up
        if (slashPresent) {
          const slashIndex: number = row.indexOf("\u2044") !== -1 ? row.indexOf("\u2044") : row.indexOf("/");
          let denominator: string = row[slashIndex + 1];
          if (!isNaN(parseInt(row[slashIndex + 2]))) {
            denominator += row[slashIndex + 2];
          }
          
          // Use Math.round() to give up to 3 decimal places
          let fractionAsdecimal: number = Math.round((parseInt(row[slashIndex - 1]) / Number(denominator)) * 1000) / 1000;
          // If there is a number before the fraction, e.g. 1 3/4 cups
          if (slashIndex !== 1) {
            const intBeforeFraction: number = parseInt(row.slice(0, slashIndex - 1));
            if (!isNaN(intBeforeFraction)) {
              fractionAsdecimal += intBeforeFraction;
            }
          }
          // Replace the fraction with the decimal version before querying the parse API
          return fractionAsdecimal + row.slice(slashIndex + 2);
        }
        return row;
      })

    const requests = recipeLinesToFetch.map((recipeLine: string) => {
      return fetch(`${parseURL}?ingredientList=${recipeLine}&servings=1&includeNutrition=false&apiKey=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        }
      })
    })

    Promise.all(requests)
    .then(responses => {
      const errors = responses.filter(response => !response?.ok);

      if (errors.length) {
        throw errors.map(response => Error(response.statusText));
      }

      const json = responses.map(response => response.json());
      return Promise.all(json)
    })
    .then(parsedRecipeData => {
      const recipeDataRequests =  parsedRecipeData.map(line => {
        const sourceAmount = line[0].amount;
        // To convert oz to grams there is no need to fetch as conversion is purely mathematical
        // Ensure response is in the same format as the parsed response for converted ingredients
        if (line[0].unitShort === "oz" && convertTo === "grams") {
          const targetAmount = Math.round(28.3495 * sourceAmount);
          return (nonConvertedOutput(line[0], targetAmount, "grams"));
          // If the user doesn't want to convert tsp/tbsp/eggs, leave them as they are
        } else if ((!selectedOptions.tsp && isSpoonMeasure(line[0].unitShort)) || 
                   (!selectedOptions.eggs && isEgg(line[0].name))) {
          return (nonConvertedOutput(line[0], sourceAmount, line[0].unit));
        } else {
          return fetch(`${convertURL}?ingredientName=${line[0].name}&sourceAmount=${line[0].amount}&sourceUnit=${line[0].unit}&targetUnit=${convertTo}&apiKey=${apiKey}`)
        }
      });

      Promise.all(recipeDataRequests)
        .then(responses => {
          // If the response is of type OutputRecipeFormat, it is already in its final format 
          const json = responses.map((response: Response | OutputRecipeFormat) => {
            return "status" in response
              ? response.json()
              : response;
          });
          return Promise.all(json);
        })
        .then(outputRecipeData => {
          // Each successful request has an 'answer' attribute
          const failedRequests = outputRecipeData.filter(response => !response?.answer);
          if (failedRequests.length) {
            failedRequests.forEach(response => {
              throw new Error(response.message);
            });
          }

          // Erase any previous errors caused by failed requests
          setErrorMsg("");
          
          const recipe: string[] = [];
          outputRecipeData.forEach((line, i) => {
            let originalRecipeLine = parsedRecipeData[i][0].original;
            const sourceUnit: string = getSourceUnit(originalRecipeLine, line);

            // If the original line had a period after the unit (c. for cup or oz. for ounches, etc) remove the period
            const sourceIndex = originalRecipeLine.indexOf(sourceUnit);
            if (originalRecipeLine[sourceIndex + sourceUnit.length] === ".") {
              originalRecipeLine = originalRecipeLine.split("");
              originalRecipeLine.splice(sourceIndex + sourceUnit.length, 1);
              originalRecipeLine = originalRecipeLine.join("");
            }
           
            let amountPlusUnit = `${line.targetAmount} ${line.targetUnit}`;
            if (fractionUnits.includes(line.targetUnit)) {
              amountPlusUnit = decimalToFraction(line.targetAmount, line.targetUnit);
            } else if (line.targetUnit === "grams") {
              amountPlusUnit = `${Math.round(line.targetAmount)} ${line.targetUnit}`;
            };
            let outputRecipeLine = originalRecipeLine.replace(sourceUnit, `${amountPlusUnit}`);

            recipe.push(outputRecipeLine);
            // setOutputRecipe once the entire recipe has been parsed and converted
            if (i === parsedRecipeData.length - 1) setOutputRecipe(recipe);
          });

          // scroll to output container once conversion is complete
          if (outputRecipeRef.current) {
            window.scrollTo({ top: outputRecipeRef.current.offsetTop, behavior: "smooth" });
          }
        })
      .catch(err => {
        console.log(err);

        if (err instanceof Error) {
          // Set an error message to prompt the user to update their recipe
          if (err.message.startsWith("Your daily points limit")) {
            setErrorMsg("The API limit has been reached. Please try again tomorrow.")
          } else {
            setErrorMsg(err.message);
          }
        }
      })
    })
    .catch(errors => {
      errors.forEach((err: unknown) => console.log(err));
      setErrorMsg("The API limit has been reached. Please try again tomorrow.")
    })
  }, [converting]);

  return (
    <div className="output-recipe-section-container" ref={outputRecipeRef}>
      <h3 className="recipe-title">Your converted recipe:</h3>
      <div className="recipe-container output-recipe-container">
        {outputRecipe.length 
          ? <div className="output-recipe">
              {outputRecipe.map((line, i) => {
                return <div key={line + i}>{line}</div>
              })}
            </div>
          : <div>
              Paste or type a recipe into the box above to get started!
            </div>
        }
      </div>
    </div>
  )
}

export default OutputRecipe;
