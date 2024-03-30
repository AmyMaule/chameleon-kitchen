import React, { useState, useEffect } from "react";

const ConvertedRecipe = ({ pastedRecipe }) => {
  const [convertedRecipe, setConvertedRecipe] = useState([]);
  const convertURL = "https://api.spoonacular.com/recipes/convert";
  const parseURL = "https://api.spoonacular.com/recipes/parseIngredients";

  useEffect(() => {
    if (!pastedRecipe.length) return;

    let parsedRecipeData;
    const recipeLinesToFetch = pastedRecipe
      .split("\n")
      .map(row => row.trim()).filter(row => row)
      // replace any unicode fraction characters with normalized strings
      .map(row => row.normalize("NFKD").replaceAll("▢", ""))
      .map(row => {
        const slashPresent = row.indexOf("\u2044") !== -1 || row.indexOf("/") !== -1;
        
        // Highly unlikely there will ever be two digits as the numerator in a recipe - deal with this edge case if it ever crops up
        if (slashPresent) {
          const slashIndex = row.indexOf("\u2044") !== -1 ? row.indexOf("\u2044") : row.indexOf("/");
          let denominator = row[slashIndex + 1];
          if (!isNaN(parseInt(row[slashIndex + 2]))) {
            denominator += row[slashIndex + 2];
          }
          
          // Use Math.round() to give up to 3 decimal places
          let fractionAsdecimal = Math.round((parseInt(row[slashIndex - 1]) / denominator) * 1000) / 1000;
          // If there is a number before the fraction, e.g. 1 3/4 cups
          if (slashIndex !== 1) {
            const preFraction = row.slice(0, slashIndex - 1);
            if (parseInt(preFraction)) {
              fractionAsdecimal += parseInt(preFraction);
            }
          }
          // Replace the fraction with the decimal version before querying the parse API
          return fractionAsdecimal + row.slice(slashIndex + 2);
        }
        return row;
      })

    const requests = recipeLinesToFetch.map(recipeLine => {
      // TODO if the line is in ounces, don't fetch, but do send a response in the same format as the parsed response
      // this may cause unexpected behavior because the fetch request is a promise?

      return fetch(`${parseURL}?ingredientList=${recipeLine}&servings=1&includeNutrition=false&apiKey=${import.meta.env.VITE_APIKEY}`, {
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
    .then(recipeData => {
      parsedRecipeData = recipeData;
      const recipeDataRequests =  recipeData.map(line => {
        return fetch(`${convertURL}?ingredientName=${line[0].name}&sourceAmount=${line[0].amount}&sourceUnit=${line[0].unit}&targetUnit=grams&apiKey=${import.meta.env.VITE_APIKEY}`)
      });

      Promise.all(recipeDataRequests)
        .then(responses => {
          if (responses.filter(response => !response?.ok).length) {
            throw responses.map(response => Error(response.statusText));
          }
          const json = responses.map(response => response.json());
          return Promise.all(json)
        })
        .then(convertedRecipeData => {
          const recipe = [];
          convertedRecipeData.forEach((line, i) => {
            // Replace the original measurement with the converted gram amounts - some lines don't have sourceUnits (e.g. 2 eggs)
            const sourceUnit = line.sourceUnit ? `${line.sourceAmount} ${line.sourceUnit}` : line.sourceAmount;
            let originalRecipeLine = parsedRecipeData[i][0].original;

            // If the original line had a period after the unit (c. for cup or oz. for ounches, etc) remove the period
            const sourceIndex = originalRecipeLine.indexOf(sourceUnit);
            if (originalRecipeLine[sourceIndex + sourceUnit.length] === ".") {
              originalRecipeLine = originalRecipeLine.split("");
              originalRecipeLine.splice(sourceIndex + sourceUnit.length, 1);
              originalRecipeLine = originalRecipeLine.join("");
            }
            let convertedRecipeLine = originalRecipeLine.replace(sourceUnit, `${Math.round(line.targetAmount)} ${line.targetUnit}`);
            recipe.push(convertedRecipeLine);

            // setConvertedRecipe once the entire recipe has been parsed and converted
            if (i === recipeData.length - 1) setConvertedRecipe(recipe);
          })
        })
      .catch(err => console.log(err))
    })
    .catch(errors => {
      errors.forEach(err => console.error(err));
    })
  }, [pastedRecipe]);

  // useEffect(() => {
  //   console.log(convertedRecipe)
  // }, [convertedRecipe])

  return (
    <div className="converted-recipe-container">
      {convertedRecipe.length 
        ? <div className="converted-recipe">
            <div>Your converted recipe:</div>
            {convertedRecipe.map(line => {
              return <div key={line}>{line}</div>
            })}
          </div>
        : <div>Paste or type a recipe into the box to get started</div>
      }
    </div>
  )
}

export default ConvertedRecipe;
