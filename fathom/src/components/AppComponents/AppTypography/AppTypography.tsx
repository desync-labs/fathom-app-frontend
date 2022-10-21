import { styled } from "@mui/material/styles";
import { Typography, Box } from "@mui/material";

export const TitleSecondary = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  color: "#fff",
  fontWeight: "bold",
  lineHeight: "24px",
  marginBottom: "10px",
}));

export const Adjust = styled(Typography)(({ theme }) => ({
  color: "#7D91B5",
  fontSize: "13px",
  fontWeight: "bold",
  paddingTop: "7px",
  marginLeft: "-10px",
}));

export const NoResults = styled(Typography)(({ theme }) => ({
  color: "#6379A1",
  fontSize: "14px",
  lineHeight: "20px",
  borderBottom: "1px solid #131F35",
  padding: "14px 10px 16px 10px",
}));

export const Summary = styled(Typography)(({ theme }) => ({
  color: "#fff",
  fontWeight: "bold",
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "15px",
}));

export const WalletBalance = styled(Typography)(({ theme }) => ({
  fontSize: "12px",
  lineHeight: "16px",
  color: "#6379A1",
  float: "right",
}));

export const ErrorMessage = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
}));

export const OpenPositionLabel = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  float: "left",
  color: "#fff",
}));

export const OpenPositionValue = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  color: "#fff",
  float: "right",
}));

export const OpenPositionWrapper = styled(Box)(({ theme }) => ({
  overflow: "hidden",
  padding: "2px 0",
}));

export const ApproveBox = styled(Box)(({ theme }) => ({
  background: "#131F35",
  borderRadius: "8px",
  padding: "12px 16px 20px",
  gap: "12px",
  marginTop: "20px",
}));

export const ApproveBoxTypography = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  lineHeight: "20px",
  color: "#9FADC6",
}));
