export const tspVariants = ["tsp", "teaspoon", "teaspoons"];
export const tbspVariants = ["tbsp", "tablespoon", "tablespoons"];

export const isSpoonMeasure = (unit: string) => {
  const spoonMeasureVariants = tspVariants.concat(tbspVariants);
  return spoonMeasureVariants.includes(unit?.toLowerCase());
};

// Ensure eggs are correctly converted and things like 'eggplant' are not included in egg conversion
export const isEgg = (ingredient: string) => {
  const eggVariants = ["egg", "eggs", "egg white", "egg whites", "egg yolk", "egg yolks"];
  return eggVariants.includes(ingredient?.toLowerCase());
};
