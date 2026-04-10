import { tspVariants, tbspVariants } from "./ingredientRules";

// pre-parse recipe lines containing a "+"
// receives format: [["1", "cup"], ["2", "tbsp", "flour"]]
const preParseDoubleIngredientRow = (splitRow: string[][]): string[] => {
  // Different egg types (e.g. 1 egg + 1 egg yolk) should go onto 2 lines
  if (splitRow[0].some(word => ["egg", "eggs"].includes(word))) {
    return [splitRow[0].join(" "), splitRow[1].join(" ")];
  }

  const spoonMeasureVariants = tspVariants.concat(tbspVariants);
  let isCup = false,
    spoonMeasure = "",
    numCups = 0,
    numSpoons = 0;
  const ingredientName = [];

  // Combine lines that contain the same ingredient (e.g. 1 cup + 2 tbsp flour) into cups
  for (const word of splitRow[0]) {
    if (["cup", "cups"].includes(word.toLowerCase())) {
      isCup = true;
    } else if (!isNaN(Number(word))) {
      numCups = Number(word);
    }
  }
  for (const word of splitRow[1]) {
    if (spoonMeasureVariants.includes(word.toLowerCase())) {
      spoonMeasure = word;
    } else if (!isNaN(Number(word))) {
      numSpoons = Number(word);
    } else {
      ingredientName.push(word);
    }
  }

  if (isCup && spoonMeasure && numCups && numSpoons) {
    if (tspVariants.includes(spoonMeasure.toLowerCase())) {
      numCups += numSpoons / 48; // tsp is 1/48 of a cup
    } else if (tbspVariants.includes(spoonMeasure.toLowerCase())) {
      numCups += numSpoons / 16; // tbsp is 1/16 of a cup
    }
    // The parse/conversion APIs store up to 7 decimal places
    // Convert to string->number->string in order to remove trailing zeroes which mess with the replacement in output data
    return [`${Number(numCups.toFixed(6).toString())} cups ${ingredientName.join(" ")}`];
  }

  // If neither of the above situations apply, return original string
  console.log(`Couldn't pre-parse ${splitRow[0].join(" ")} + ${splitRow[1].join(" ")}`);
  return [`${splitRow[0].join(" ")} + ${splitRow[1].join(" ")}`];
};

export const parseRecipeText = (recipe: string): string[] => {
  return (
    recipe
      .split("\n")
      .map((row: string) => {
        // replace any unicode fraction characters with normalized strings, replace t/T because the API doesn't recognize them
        row = row.normalize("NFKD").replaceAll("▢", "").replace(" t ", " tsp ").replace(" T ", " tbsp ").toLowerCase();

        // If the first character of the line is not a number, slice from the first num
        if (isNaN(Number(row[0]))) {
          const rowArr = row.split("");
          let firstNum = rowArr.findIndex(char => !isNaN(Number(char)) && char !== " ");
          // if there are no numbers in the row, get the first letter instead e.g. "pinch nutmeg"
          if (firstNum === -1) {
            firstNum = rowArr.findIndex(char => /[a-zA-Z]/.test(char));
          }
          return row.slice(firstNum).trim();
        }
        return row;
      })
      .filter((row: string) => row)
      .map((row: string) => {
        // Eggs are not correctly parsed if a space is not included before the unit "egg"
        if (row.includes("egg") && !row.includes(" egg")) {
          row = row.replace(/(\d+)(eggs?)/gi, "$1 $2");
        }

        const slashPresent: boolean = row.indexOf("\u2044") !== -1 || row.indexOf("/") !== -1;

        // Highly unlikely there will ever be two digits as the numerator in a recipe - deal with this edge case if it ever crops up
        if (slashPresent) {
          const slashIndex: number = row.indexOf("\u2044") !== -1 ? row.indexOf("\u2044") : row.indexOf("/");
          let denominator: string = row[slashIndex + 1];
          if (!isNaN(parseInt(row[slashIndex + 2]))) {
            denominator += row[slashIndex + 2];
          }

          // Use Math.round() to give up to 3 decimal places
          let fractionAsDecimal: number =
            Math.round((parseInt(row[slashIndex - 1]) / Number(denominator)) * 1000) / 1000;
          // If there is a number before the fraction, e.g. 1 3/4 cups
          if (slashIndex !== 1) {
            const intBeforeFraction: number = parseInt(row.slice(0, slashIndex - 1));
            if (!isNaN(intBeforeFraction)) {
              fractionAsDecimal += intBeforeFraction;
            }
          }
          // Replace the fraction with the decimal version before querying the parse API
          row = fractionAsDecimal + row.slice(slashIndex + 2);
        }

        // check if + sign in the row - if so, pre-parse it into 1 combined line or onto 2 lines
        if (row.includes("+")) {
          const splitRow = row.split("+").map(ing => ing.split(" ").filter(item => item));
          return preParseDoubleIngredientRow(splitRow);
        }
        return row;
      })
      // Flatten: if a row had to be split onto 2 lines in pre-parsing, it would be returned as string[] instead of a string
      .flat()
  );
};
