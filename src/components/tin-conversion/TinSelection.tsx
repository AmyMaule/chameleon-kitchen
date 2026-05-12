import { TinConfig } from "../../types";
import TinSizeSelect from "./TinSizeSelect";
import TinShapeSelect from "./TinShapeSelect";

// To do:
// deal with custom tin sizes
// Circle: diameter
// Square: width
// Rectangle: width & height

type TinSelectionProps = {
  label: string;
  tin: TinConfig;
  onChange: (patch: Partial<TinConfig>) => void;
};

const TinSelection = ({ label, tin, onChange }: TinSelectionProps) => {
  return (
    <div className="tin-size-column">
      <h3 className="tin-size-selection-title">{label}</h3>
      <div className="tin-size-select-container">
        <TinShapeSelect selectedShape={tin.shape} setShape={shape => onChange({ shape })} />
      </div>
      <div className="tin-size-select-container">
        <div className="tin-size-select-label">Size:</div>
        <TinSizeSelect value={tin.size} onChange={size => onChange({ size })} />
      </div>
    </div>
  );
};

export default TinSelection;
