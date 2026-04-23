import { OutputRecipeFormat, ParsedRecipeFormat } from "../types";

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

const decimalToFraction = (amount: number, unit: string = "cup") => {
  // If 'cups' or 'grams' are passed in, ensure they become singular
  if (unit.endsWith("s")) unit = unit.slice(0, unit.length - 1);
  const integer = Math.floor(amount);

  // round remaining decimal to nearest 1/8 or 1/3 as cups are multiples of either 1/8 or 1/3
  const fractionToNearestEighth = Math.round((amount - integer) * 8) / 8;
  const fractionToNearestThird = Math.round((amount - integer) * 3) / 3;

  // find out whether the nearest eighth or third is closest to the decimal input
  const decimal = Math.abs(amount - integer);
  const closestFraction =
    Math.abs(fractionToNearestThird - decimal) < Math.abs(fractionToNearestEighth - decimal)
      ? fractionToNearestThird
      : fractionToNearestEighth;

  // if amount is an int or the fraction is closer to an int than to a fraction (e.g. 2.95 tsp should be 3 tsp not 2 7/8 tsp)
  // round to nearest whole number without further calculations
  if (closestFraction === 0 || closestFraction === 1) {
    return integer === 1 ? `${Math.round(amount)} ${unit}` : `${Math.round(amount)} ${unit}s`;
  }

  let denominator = closestFraction === fractionToNearestEighth ? 8 : 3;
  let numerator = Math.round(closestFraction * denominator);

  const divisor = highestCommonFactor(numerator, denominator);
  numerator /= divisor;
  denominator /= divisor;

  const fraction = integer ? `${integer} ${numerator}/${denominator}` : `${numerator}/${denominator}`;

  return integer <= 1 ? `${fraction} ${unit}` : `${fraction} ${unit}s`;
};

export const getSourceUnit = (line: OutputRecipeFormat, parsedRecipeData: ParsedRecipeFormat): string => {
  // Replace the original measurement with the converted gram amounts - some lines don't have sourceUnits (e.g. 2 eggs)
  const sourceUnit = line.sourceUnit ? `${line.sourceAmount} ${line.sourceUnit}` : line.sourceAmount.toString();

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
};

const buildOutputLine = (line: OutputRecipeFormat, parsedLine: ParsedRecipeFormat): string => {
  let originalRecipeLine = parsedLine.original;
  const sourceUnit = getSourceUnit(line, parsedLine).toLowerCase();
  const sourceIndex = originalRecipeLine.indexOf(sourceUnit);

  // If sourceUnit isn’t found, return as is
  if (sourceIndex === -1) return originalRecipeLine;

  // If the original line had a period after the unit (c. for cup or oz. for ounces, etc) remove the period
  if (originalRecipeLine[sourceIndex + sourceUnit.length] === ".") {
    const chars = originalRecipeLine.split("");
    chars.splice(sourceIndex + sourceUnit.length, 1);
    originalRecipeLine = chars.join("");
  }

  let amountPlusUnit = line.targetAmount ? `${line.targetAmount} ${line.targetUnit}` : "";
  if (fractionUnits.includes(line.targetUnit)) {
    amountPlusUnit = decimalToFraction(line.targetAmount, line.targetUnit);
  } else if (line.targetUnit === "grams") {
    amountPlusUnit = `${Math.round(line.targetAmount)} ${line.targetUnit}`;
  }

  // If input was 3eggs, add a space so output is 44 grams eggs not 44 gramseggs
  const additionalSpace = originalRecipeLine[sourceIndex + sourceUnit.length] !== " " ? " " : "";

  return originalRecipeLine.replace(sourceUnit, amountPlusUnit + additionalSpace);
};

export const buildOutputRecipe = (
  outputRecipeData: OutputRecipeFormat[],
  parsedRecipeData: ParsedRecipeFormat[][]
): string[] => {
  return outputRecipeData.map((line, i) => buildOutputLine(line, parsedRecipeData[i][0]));
};
