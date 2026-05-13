import Select from "react-select";
import type { StylesConfig, CSSObjectWithLabel, SingleValue } from "react-select";
import { TinSizeOption } from "../../types";
import { tinSizeOptions } from "../../utils/constants";

type TinSizeSelectProps = {
  value: TinSizeOption | null;
  onChange: (option: SingleValue<TinSizeOption>) => void;
};

const selectStyles: StylesConfig<TinSizeOption, false> = {
  container: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
    ...base,
    width: "100%",
    maxWidth: "12rem"
  }),

  // The value that displays once selected
  singleValue: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
    ...base,
    fontSize: "24px"
  }),

  option: (base: CSSObjectWithLabel, state): CSSObjectWithLabel => ({
    ...base,
    fontSize: "24px",
    backgroundColor: state.isSelected
      ? "var(--react-select-selected)"
      : state.isFocused
        ? "var(--react-select-accent)"
        : base.backgroundColor
  }),

  placeholder: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
    ...base,
    fontSize: "24px"
  })
};

const TinSizeSelect = ({ value, onChange }: TinSizeSelectProps) => {
  return <Select options={tinSizeOptions} styles={selectStyles} value={value} onChange={onChange} />;
};

export default TinSizeSelect;
