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

export type ParsedRecipeFormat = {
  original: string,
  name: string,
  amount: number,
  unit: string
}

export type ConvertToType = "cups" | "grams";
