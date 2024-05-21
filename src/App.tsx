import { useState, useEffect } from "react";

import { 
  ConvertToType,
  SelectedOptionsType 
} from "./types";

import Footer from "./components/Footer";
import Header from "./components/Header";
import InputRecipe from "./components/InputRecipe";
import Intro from "./components/Intro";
import OutputRecipe from "./components/OutputRecipe";

const App = () => {
  const [converting, setConverting] = useState(false);
  const [convertTo, setConvertTo] = useState<ConvertToType>("grams");
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
          convertTo={convertTo}
          setPastedRecipe={setPastedRecipe} 
          setSelectedOptions={setSelectedOptions}
          setConverting={setConverting}
          setConvertTo={setConvertTo}
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
          convertTo={convertTo}
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
