// use Euclidean algorithm to get highest common factor of numerator and denominator
function highestCommonFactor(numerator: number, denominator: number) {
  while (denominator !== 0) {
    let remainder = numerator % denominator;
    numerator = denominator;
    denominator = remainder;
  }
  // Return the last non-zero remainder as the highest common factor
  return numerator;
}

  export const convertCupsToFraction = (amount: number) => {
  const integer = Math.floor(amount);
  // round remaining decimal to nearest 1/8 or 1/3 as cups are multiples of either 1/8 or 1/3
  const fractionToNearestEighth = Math.round((amount - integer) * 8) / 8;
  const fractionToNearestThird = Math.round((amount - integer) * 3) / 3;

  // find out whether the nearest eighth or third is closest to the decimal input
  const closestFraction = Math.abs(fractionToNearestThird - amount) < Math.abs(fractionToNearestEighth - amount)
    ? fractionToNearestThird
    : fractionToNearestEighth

  // if amount is an integer
  if (closestFraction === 0) {
    return integer > 1 ? `${integer} cups` : `${integer} cup`;
  }

  let denominator = closestFraction === fractionToNearestEighth ? 8 : 3;
  let numerator = Math.round(closestFraction * denominator);

  let divisor = highestCommonFactor(numerator, denominator);
  numerator /= divisor;
  denominator /= divisor;

  let fraction = integer ? `${integer} ${numerator}/${denominator}` : `${numerator}/${denominator}`; 
  return integer > 1 ? `${fraction} cups` : `${fraction} cup`;
}
