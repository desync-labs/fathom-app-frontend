import { styled } from "@mui/material/styles";
import {
  TextField as MuiTextField,
  FormLabel as MuiFormLabel,
  Box,
} from "@mui/material";

export const AppTextField = styled(
  MuiTextField,
  {}
)(({ theme }) => ({
  width: "100%",
  padding: 0,
  margin: 0,
  marginBottom: "15px",
  input: {
    background: "#0D1526",
    border: "1px solid #1D2D49",
    borderRadius: " 8px",
    height: "40px",
    width: "100%",
    padding: "0 50px 0 35px",
    fontSize: "14px",
    lineJeight: "20px",
    color: "#4F658C",
  },
  "& .Mui-error input": {
    color: "#f44336",
  },
  "& input:disabled": {
    cursor: "not-allowed !important",
    pointerEvents: "all !important",
  },
  "& fieldset": { border: "none" },
  ".MuiFormHelperText-root": {
    marginLeft: 0,
    color: "#6379A1",
  },
}));

export const AppFormLabel = styled(
  MuiFormLabel,
  {}
)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: "10.5px",
  lineHeight: "16px",
  color: "#6379A1",
  textTransform: "uppercase",
  float: "left",
  paddingBottom: "5px",
}));

export const AppFormInputWrapper = styled(
  Box,
  {}
)(({ theme }) => ({
  position: "relative",
}));

export const AppFormInputLogo = styled("img")({
  width: "20px",
  height: "20px",
  position: "absolute",
  top: "32px",
  left: "9px",
});
