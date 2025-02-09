import { 
  OutputRecipeFormat,
  ParsedRecipeFormat
} from "./types";

// Ensure eggs are correctly converted and things like 'eggplant' are not included in egg conversion
export const isEgg = (ingredient: string) => {
  const eggVariants = ["egg", "eggs", "egg white", "egg whites", "egg yolk", "egg yolks"];
  return eggVariants.includes(ingredient?.toLowerCase());
}

export const tspVariants = ["tsp", "teaspoon", "teaspoons"];
export const tbspVariants = ["tbsp", "tablespoon", "tablespoons"];

export const isSpoonMeasure = (unit: string) => {
  const spoonMeasureVariants = tspVariants.concat(tbspVariants);
  return spoonMeasureVariants.includes(unit?.toLowerCase());
}

export const fractionUnits = ["cup", "cups", "tsp", "teaspoon", "teaspoons", "tbsp", "tablespoon", "tablespoons"];

  // use Euclidean algorithm to get highest common factor of numerator and denominator
function highestCommonFactor(numerator: number, denominator: number) {
  while (denominator !== 0) {
    const remainder = numerator % denominator;
    numerator = denominator;
    denominator = remainder;
  }
  // Return the last non-zero remainder as the highest common factor
  return numerator;
}

export const decimalToFraction = (amount: number, unit: string = "cup") => {
  // If 'cups' or 'grams' are passed in, ensure they become singular
  if (unit.endsWith("s")) unit = unit.slice(0, unit.length - 1);
  const integer = Math.floor(amount);
  
  // round remaining decimal to nearest 1/8 or 1/3 as cups are multiples of either 1/8 or 1/3
  const fractionToNearestEighth = Math.round((amount - integer) * 8) / 8;
  const fractionToNearestThird = Math.round((amount - integer) * 3) / 3;

  // find out whether the nearest eighth or third is closest to the decimal input
  const decimal = Math.abs(amount - integer);
  const closestFraction = Math.abs(fractionToNearestThird - decimal) < Math.abs(fractionToNearestEighth - decimal)
    ? fractionToNearestThird
    : fractionToNearestEighth

  // if amount is an int or the fraction is closer to an int than to a fraction (e.g. 2.95 tsp should be 3 tsp not 2 7/8 tsp)
  // round to nearest whole number without further calculations
  if (closestFraction === 0 || closestFraction === 1) {
    return integer === 1
      ? `${Math.round(amount)} ${unit}` 
      : `${Math.round(amount)} ${unit}s`;
  }

  let denominator = closestFraction === fractionToNearestEighth ? 8 : 3;
  let numerator = Math.round(closestFraction * denominator);

  const divisor = highestCommonFactor(numerator, denominator);
  numerator /= divisor;
  denominator /= divisor;

  const fraction = integer ? `${integer} ${numerator}/${denominator}` : `${numerator}/${denominator}`;

  return integer <= 1
    ? `${fraction} ${unit}` 
    : `${fraction} ${unit}s`;
}

export const getSourceUnit = (line: OutputRecipeFormat, parsedRecipeData: ParsedRecipeFormat): string => {
  // Replace the original measurement with the converted gram amounts - some lines don't have sourceUnits (e.g. 2 eggs)
  const sourceUnit = line.sourceUnit 
    ? `${line.sourceAmount} ${line.sourceUnit}` 
    : line.sourceAmount.toString()
    
  if (parsedRecipeData.original.indexOf(sourceUnit) !== -1) {
    return sourceUnit;
  } else {
    // The API sometimes creates a unit ("serving") if none existed initially, return original recipe line minus ingredient name
    if (sourceUnit.includes("serving") && !parsedRecipeData.original.includes("serving")) {
      return parsedRecipeData.original.replace(parsedRecipeData.name, "");
    }
    // remove spaces if original recipe had no spaces
    return sourceUnit.replace(/\s+/g, "");
  }
}

// pre-parse recipe lines containing a "+" 
// receives format: [["1", "cup"], ["2", "tbsp", "flour"]]
export const preParseDoubleIngredientRow = (splitRow: string[][]): string[] => {
  // Different egg types (e.g. 1 egg + 1 egg yolk) should go onto 2 lines
  if (splitRow[0].some(word => ["egg", "eggs"].includes(word))) {
    return [splitRow[0].join(" "), splitRow[1].join(" ")]
  }

  const spoonMeasureVariants = tspVariants.concat(tbspVariants);
  let isCup = false, spoonMeasure = "", numCups = 0, numSpoons = 0;
  let ingredientName = "";

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
      ingredientName += word;
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
    return [`${Number(numCups.toFixed(6).toString())} cups ${ingredientName}`];
  }

  // If neither of the above situations apply, return original string
  console.log(`Couldn't pre-parse ${splitRow[0].join(" ")} + ${splitRow[1].join(" ")}`);
  return [`${splitRow[0].join(" ")} + ${splitRow[1].join(" ")}`];
}
