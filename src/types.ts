export type SelectedOptionsType = {
  [key: string]: boolean;
};

export type RecipeLineType = {
  amount: number,
  unit: string,
  name: string,
}

export type OutputRecipeFormat = {
  answer: string,
  sourceAmount: number,
  sourceUnit: string,
  targetAmount: number,
  targetUnit: string,
  type: "CONVERSION"
}

export type ConvertToType = "cups" | "grams";
