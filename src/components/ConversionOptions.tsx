import { SelectedOptionsType } from '../types';

type ConversionOptionsProps = {
  setSelectedOptions: Function
}


const ConversionOptions = ({ setSelectedOptions }: ConversionOptionsProps) => {
  const handleSelectedOptions = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOptions((prevOptions: SelectedOptionsType) => {
      return { ...prevOptions, [e.target.id]: e.target.checked}
    })
  }

  return (
    <div className="conversion-options-container">
      <label className="conversion-option-label">
        Convert eggs
        <input
          className="conversion-option-checkbox"
          id="eggs"
          onChange={handleSelectedOptions}
          type="checkbox"
        />
      </label>
      <label className="conversion-option-label">
        Convert teaspoons, tablespoons, etc
        <input
          className="conversion-option-checkbox"
          id="tsp"
          onChange={handleSelectedOptions}
          type="checkbox"
        />
      </label>
    </div>
  )
}

export default ConversionOptions;
