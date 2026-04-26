import { TinSizeOption } from "../../types";
import TinSelect from "./TinSelect";

// To do:
// deal with custom tin sizes
// deal with custom shapes - square, rectangle, round, bundt

type TinSizeSelectionProps = {
  fromTinSize: TinSizeOption | null;
  toTinSize: TinSizeOption | null;
  setFromTinSize: React.Dispatch<React.SetStateAction<TinSizeOption | null>>;
  setToTinSize: React.Dispatch<React.SetStateAction<TinSizeOption | null>>;
};

const TinSizeSelection = ({ fromTinSize, setFromTinSize, toTinSize, setToTinSize }: TinSizeSelectionProps) => {
  return (
    <div className="tin-size-conversion-container">
      <h4 className="tin-size-title">Convert a recipe...</h4>
      <div className="tin-size-selection-container">
        <div className="tin-size-column">
          <h3 className="tin-size-selection-title">From this tin...</h3>
          <div className="tin-size-select-container">
            <div className="tin-size-select-label">Size:</div>
            <TinSelect value={fromTinSize} onChange={option => setFromTinSize(option)} />
          </div>
        </div>
        <div className="tin-size-column">
          <h3 className="tin-size-selection-title">...to this tin</h3>
          <div className="tin-size-select-container">
            <div className="tin-size-select-label">Size:</div>
            <TinSelect value={toTinSize} onChange={option => setToTinSize(option)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TinSizeSelection;
