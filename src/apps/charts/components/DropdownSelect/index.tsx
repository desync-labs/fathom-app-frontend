import { FC, memo } from "react";
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
} from "@mui/material";

const Wrapper = styled(FormControl)`
  position: relative;
  min-width: 120px;
  max-width: max-content;
  z-index: 20;

  .MuiOutlinedInput-notchedOutline {
    border-color: #253656;
    border-radius: 8px;
  }
  .Mui-focused .MuiOutlinedInput-notchedOutline {
    border: 1px solid rgb(90, 129, 255) !important;
    box-shadow: rgb(0, 60, 255) 0 0 8px;
  }
  .MuiSelect-select {
    background-color: #253656;
    border-radius: 8px;
  }
`;

type DropdownSelectProps = {
  options: any;
  active: any;
  setActive: any;
  color?: string;
  shadow?: string;
  style?: Record<string, any>;
};

const DropdownSelect: FC<DropdownSelectProps> = (props) => {
  const { active, setActive, options } = props;
  const handleChange = (event: SelectChangeEvent) => {
    setActive(event.target.value as string);
  };

  console.log("Props", props);

  return (
    <Wrapper size="small" style={props.style}>
      <Select id="app-select" value={active} onChange={handleChange}>
        {Object.keys(options).map((key, index) => {
          const option = options[key];
          return (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          );
        })}
      </Select>
    </Wrapper>
  );
};

export default memo(DropdownSelect);
