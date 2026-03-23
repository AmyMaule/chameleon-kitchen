import { useRef } from "react";
import RecipeTextarea from "../RecipeTextArea";
import OutputRecipeContainer from "../OutputRecipeContainer";

const TinConversion = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const outputRecipeRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <RecipeTextarea textareaRef={textareaRef} />
      <OutputRecipeContainer outputRecipe={[""]} outputRecipeRef={outputRecipeRef} />
    </>
  );
};

export default TinConversion;
