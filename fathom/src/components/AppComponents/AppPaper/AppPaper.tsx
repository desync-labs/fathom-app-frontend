import { Paper as MuiPaper } from "@mui/material";
import { styled } from "@mui/material/styles";

export const AppPaper = styled(
  MuiPaper,
  {}
)(({ theme }) => ({
  background: "#101D32",
  border: "1px solid #101D32",
  borderRadius: "8px",
}));

export const AppSecondaryPaper = styled(
  MuiPaper,
  {}
)(({ theme }) => ({
  background: "#192C46",
  border: "1px solid #101D32",
  borderRadius: "8px",
}));

export const AppMainPaper = styled(
  MuiPaper,
  {}
)(({ theme }) => ({
  border: "1px solid #101D32",
  background: "linear-gradient(0deg, #011029 0%, #0A1932 93.93%)",
  borderRadius: "12px",
}));

export const StableSwapPaper = styled(AppPaper)(({ theme }) => ({
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: "10px",
  background: "#131F35",
  border: "1px solid #253656",
  borderRadius: "16px",
}));
