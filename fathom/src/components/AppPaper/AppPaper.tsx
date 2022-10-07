import { Paper as MuiPaper } from "@mui/material";
import { styled } from "@mui/material/styles";

const AppPaper = styled(MuiPaper, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  background: "#101D32",
  border: "1px solid #101D32",
  borderRadius: "8px",
}));

const AppMainPaper = styled(MuiPaper, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  border: "1px solid #101D32",
  background: "linear-gradient(0deg, #011029 0%, #0A1932 93.93%)",
  borderRadius: "12px",
}));

export  {
  AppPaper,
  AppMainPaper
};
