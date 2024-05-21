import { ConvertToType } from "../types";

type ConversionUnitProps = {
  convertTo: ConvertToType,
  setConvertTo: React.Dispatch<React.SetStateAction<ConvertToType>>
}

const ConversionUnit = ({ convertTo, setConvertTo }: ConversionUnitProps) => {
  const handleSetConvertTo = () => {
    setConvertTo((prevUnit: ConvertToType) => prevUnit === "grams" ? "cups" : "grams");
  }

  return (
    <div className="conversion-dropdown-container" onClick={handleSetConvertTo}>
      <div className={`conversion-dropdown ${convertTo === "grams" ? "conversion-dropdown-grams" : "conversion-dropdown-cups"}`}>
        {convertTo}
      </div>
    </div>
  )
}

export default ConversionUnit;
