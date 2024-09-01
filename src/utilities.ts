// Ensure eggs are correctly converted and things like 'eggplant' are not included in egg conversion
export const isEgg = (ingredient: string) => {
  const eggVariants = ["egg", "eggs", "egg white", "egg whites", "egg yolk", "egg yolks"];
  return eggVariants.includes(ingredient?.toLowerCase());
}

export const isSpoonMeasure = (unit: string) => {
  const spoonMeasureVariants = ["tsp", "tbsp", "teaspoon", "tablespoon"];
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
