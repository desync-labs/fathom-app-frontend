import { styled } from "@mui/material/styles";
import {
  TextField as MuiTextField,
  FormLabel as MuiFormLabel,
  Select,
} from "@mui/material";

export const AppTextField = styled(MuiTextField)`
  width: 100%;
  padding: 0;
  margin: 0;
  input,
  textarea {
    background: #071028;
    border-radius: 8px;
    height: 40px;
    width: 100%;
    padding: 0 50px 0 35px;
    font-size: 14px;
    line-height: 20px;
    color: #4f658c;
    border: 1px solid #253656;
    &:hover,
    &:focus {
      border: 1px solid #5a81ff;
      box-shadow: 0 0 8px #003cff;
    }
  }

  textarea {
    padding: 8px 6px 8px 16px;
    min-height: 20px;
    font-size: 14px;
    line-height: 20px;
  }

  input[type="number"] {
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
    }
  }

  & .MuiOutlinedInput-root {
    padding: 0;
  }

  &.MuiTextField-root.MuiFormControl-root {
    margin-top: 0;
    width: 100%;
  }

  & input:disabled,
  textarea:disabled {
    background: unset;
    border: 1px solid #3d5580;
    color: #3d5580;
    cursor: not-allowed;
    pointer-events: all;
    &:hover,
    &:focus {
      box-shadow: unset;
    }
  }

  & .Mui-error input,
  & .Mui-error textarea {
    color: #f44336;
    text-fill-color: #f44336;
    border: 1px solid #f44336;
  }

  & fieldset {
    border: none;
  }

  .MuiFormHelperText-root {
    margin-left: 0;
    margin-top: 0;
    color: #6379a1;
    &.Mui-error {
      color: #dd3c3c;
    }
    p {
      padding-left: 0;
    }
  }
`;

export const AppFormLabel = styled(MuiFormLabel)`
  font-weight: bold;
  font-size: 10.5px;
  line-height: 16px;
  color: #6379a1;
  text-transform: uppercase;
  float: left;
  padding-bottom: 0;
`;

export const AppFormInputWrapper = styled("div")`
  position: relative;
  margin-bottom: 15px;
`;

export const AppFormInputLogo = styled("img")`
  width: 20px;
  height: 20px;
  position: absolute;
  top: 27px;
  left: 9px;
`;

export const AppSelect = styled(Select)`
  padding: 8px 12px;
  gap: 8px;
  height: 40px;
  background: #1d2d49;
  border: 1px solid #324567;
  border-radius: 8px;
  width: 100%;
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

export const AppFormInputErrorWrapper = styled("span")`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
