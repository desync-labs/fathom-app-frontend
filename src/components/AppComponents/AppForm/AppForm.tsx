import { styled } from "@mui/material/styles";
import {
  TextField as MuiTextField,
  FormLabel as MuiFormLabel,
  Select,
  Box,
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

export const AppTextFieldV2 = styled(MuiTextField)`
  width: 100%;
  margin: 0;
  padding: 4px 0 0;

  input,
  textarea {
    height: 42px;
    width: 100%;
    background: #091433;
    color: #fff;
    font-size: 18px;
    font-weight: 500;
    line-height: 20px;
    border: 1px solid #2c4066;
    border-radius: 8px;
    padding: 0 72px 18px 40px;

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
    height: 46px;
    background: unset;
    border: 1px solid #2c4066;
    color: #566e99;
    -webkit-text-fill-color: unset;
    cursor: not-allowed;
    pointer-events: all;
    padding: 0 72px 0 40px;

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

  ${({ theme }) => theme.breakpoints.down("sm")} {
    input,
    textarea {
      height: 34px;
      font-size: 12px;
      padding: 0 52px 12px 34px;
    }

    & input:disabled,
    textarea:disabled {
      height: 38px;
      padding: 0 52px 0 34px;
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

export const AppFormLabelRow = styled(Box)`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: flex-end;
  height: 20px;
`;
export const AppFormLabelV2 = styled(MuiFormLabel)`
  color: #b7c8e5;
  font-size: 11px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0.44px;
  text-transform: uppercase;
`;

export const AppFormInputWrapper = styled("div")`
  position: relative;
  margin-bottom: 15px;
`;
export const AppFormInputWrapperV2 = styled("div")`
  position: relative;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const AppFormInputLogo = styled("img")`
  width: 20px;
  height: 20px;
  position: absolute;
  top: 27px;
  left: 9px;
`;
export const AppFormInputLogoV2 = styled("img")`
  position: absolute;
  top: 36px;
  left: 9px;
  width: 24px;
  height: 24px;
  filter: drop-shadow(0px 4px 40px rgba(0, 7, 21, 0.3));
  border-radius: 50%;

  &.extendedInput {
    top: 43px;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 18px;
    height: 18px;
    top: 35px;

    &.extendedInput {
      top: 40px;
    }
  }
`;
export const AppFormInputUsdIndicator = styled("div")`
  position: absolute;
  top: 58px;
  left: 40px;
  color: #b7c8e5;
  font-size: 14px;
  font-weight: 400;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    top: 50px;
    left: 35px;
    font-size: 11px;
  }
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
