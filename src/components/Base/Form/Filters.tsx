import { styled } from "@mui/material/styles";
import { Select } from "@mui/material";
import { BaseTextField } from "components/Base/Form/StyledForm";

import SearchSrc from "assets/svg/search.svg";

export const BaseSearchTextField = styled(BaseTextField)`
  input {
    background: #091433;
    height: 38px;
    color: #8ea4cc;
    border: 1px solid #3d5580;
  }
`;

export const BaseFormInputLogo = styled("img")`
  width: 20px;
  height: 20px;
  position: absolute;
  top: 27px;
  left: 9px;
`;

export const SearchFieldLogo = () => {
  return (
    <BaseFormInputLogo
      sx={{ top: "10px", left: "9px" }}
      src={SearchSrc}
      alt="search"
    />
  );
};

export const BaseSortSelect = styled(Select)`
  width: auto;
  height: 40px;
  min-width: 100px;
  background: #091433;
  border: 1px solid #3d5580 !important;
  border-radius: 8px;

  & .MuiSelect-select {
    background-color: transparent !important;
  }

  &:hover,
  &:focus {
    border: 1px solid #5a81ff;
    box-shadow: 0 0 8px #003cff;
  }
  &.Mui-focused .MuiOutlinedInput-notchedOutline {
    border: 1px solid #5a81ff !important;
    box-shadow: 0 0 8px #003cff !important;
  }
  fieldset {
    border: none !important;
    outline: none !important;
  }
`;
