import Select from "react-select";
import type { StylesConfig, CSSObjectWithLabel, SingleValue } from "react-select";
import { TinSizeOption } from "../../types";
import { tinSizeOptions } from "../../utils/constants";

type TinSelectProps = {
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

  option: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
    ...base,
    fontSize: "24px"
  }),

  placeholder: (base: CSSObjectWithLabel): CSSObjectWithLabel => ({
    ...base,
    fontSize: "24px"
  })
};

const TinSelect = ({ value, onChange }: TinSelectProps) => {
  return <Select options={tinSizeOptions} styles={selectStyles} value={value} onChange={onChange} />;
};

export default TinSelect;
