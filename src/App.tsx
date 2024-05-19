import { useState, useEffect } from "react";

import { SelectedOptionsType } from "./types";

import Footer from "./components/Footer";
import Header from "./components/Header";
import InputRecipe from "./components/InputRecipe";
import Intro from "./components/Intro";
import OutputRecipe from "./components/OutputRecipe";

// TO DO: target unit from dropdown - initially just use grams

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

  const [converting, setConverting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [pastedRecipe, setPastedRecipe] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptionsType>({
    eggs: false,
    tsp: false
  });

  useEffect(() => {
    console.log(pastedRecipe);
  }, [pastedRecipe]);

  return (
    <div className="app-container">
      <Header />
      <Intro />
      <div className="recipe-section">
        <InputRecipe
          setPastedRecipe={setPastedRecipe} 
          setSelectedOptions={setSelectedOptions}
          setConverting={setConverting}
        />

        {errorMsg && 
          <div className="recipe-error-container">
            <h6 className="recipe-error-text">
              Oops! An error has occurred:{"\n"}
              {errorMsg}
            </h6>
          </div>
        }
        
        <OutputRecipe 
          converting={converting}
          pastedRecipe={pastedRecipe} 
          selectedOptions={selectedOptions}
          setConverting={setConverting}
          setErrorMsg={setErrorMsg}
        />
      </div>
      <Footer />
    </div>
  )
}

export default App;
