import { tinShapeOptions } from "../../utils/constants";
import { TinShapeOption } from "../../types";

type TinShapeSelectProps = {
  selectedShape: TinShapeOption;
  setShape: (shape: TinShapeOption) => void;
};

const TinShapeSelect = ({ selectedShape, setShape }: TinShapeSelectProps) => {
  return (
    <>
      <div className="tin-shape-container">
        {tinShapeOptions.map(option => {
          return (
            <div
              className={`tin-shape-img-container ${selectedShape.value === option.value ? "selected" : ""}`}
              key={option.value}
              onClick={() => setShape(option)}
            >
              <img className="tin-shape-img" src={option.image} />
              <label className="tin-shape-label">{option.label}</label>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TinShapeSelect;
