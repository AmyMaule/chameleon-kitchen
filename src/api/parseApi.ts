const parseURL = "https://api.spoonacular.com/recipes/parseIngredients";
const apiKey: string = import.meta.env.VITE_APIKEY;

export const parseIngredients = async (recipeLines: string[]) => {
  const requests = recipeLines.map((recipeLine: string) => {
    return fetch(`${parseURL}?ingredientList=${recipeLine}&servings=1&includeNutrition=false&apiKey=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      }
    });
  });

  const responses = await Promise.all(requests);

  const errors = responses.filter(response => !response?.ok);
  if (errors.length) {
    throw errors.map(response => Error(response.statusText));
  }

  const parsedRecipeData = await Promise.all(responses.map(response => response.json()));
  return parsedRecipeData;
};
