import React, { useState, useEffect } from "react";

import ConvertedRecipe from "./ConvertedRecipe";

// target unit from dropdown - initially just use grams
// have a simple "to metric" option?
// Have a button "convert eggs" if eggs are detected in the text? Most people probably don't want the eggs in grams.
// have a button to convert teaspoons/tablespoons or leave them as they are
// for ounces, don't parse or convert them, just do an inplace replace.

const App = () => {
  // ¾ cup all-purpose flour
  // ¼ cup granulated sugar
  // ¾ teaspoon ground cinnamon
  // ⅛ teaspoon salt
  // ¼ cup + 2 Tablespoons of milk
  // ¼ cup + 2 teaspoons vegetable or canola oil
  // ½ teaspoons ground cinnamon

  const [pastedRecipe, setPastedRecipe] = useState(`   
  16 oz. cream cheese, room temperature
  2 eggs, whites and yolks separated at room temperature
  3/4 c. granulated sugar
  1/2 tsp salt
  1 tsp vanilla extract
  dash of granulated sugar
  `);

  useEffect(() => {
    console.log(pastedRecipe);
  }, [pastedRecipe]);

  return (
    <div>
      <textarea />
      <ConvertedRecipe pastedRecipe={pastedRecipe} />
    </div>
  )
}

export default App;
