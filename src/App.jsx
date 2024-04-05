import React, { useState, useEffect } from "react";

import Header from "./components/Header";
import InputRecipe from "./components/InputRecipe";
import Intro from "./components/Intro";
import OutputRecipe from "./components/OutputRecipe";

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
  // 16 oz. cream cheese, room temperature
  // 2 eggs, whites and yolks separated at room temperature
  // 3/4 c. granulated sugar
  // 1/2 tsp salt
  // 1 tsp vanilla extract
  // dash of granulated sugar

  const [errorMsg, setErrorMsg] = useState("");
  const [pastedRecipe, setPastedRecipe] = useState();

  useEffect(() => {
    console.log(pastedRecipe);
  }, [pastedRecipe]);

  return (
    <div className="app-container">
      <Header />
      <Intro />
      <div className="recipe-section">
        <InputRecipe setPastedRecipe={setPastedRecipe} />

        {errorMsg && 
          <div className="recipe-error-container">
            <h6 className="recipe-error-text">
              Oops! An error has occurred:{"\n"}
              {errorMsg}
            </h6>
          </div>
        }
        
        <OutputRecipe 
          pastedRecipe={pastedRecipe} 
          setErrorMsg={setErrorMsg}
        />
      </div>
    </div>
  )
}

export default App;
