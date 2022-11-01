import { styled } from "@mui/material/styles";
import { Typography, Box as MuiBox, Chip as MuiChip } from "@mui/material";

export const TitleSecondary = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  color: "#fff",
  fontWeight: "bold",
  lineHeight: "24px",
  marginBottom: "10px",
}));

export const Adjust = styled(Typography)(({ theme }) => ({
  fontSize: "13px",
  fontWeight: "bold",
  paddingTop: "7px",
  marginLeft: "-10px",
  color: "#43FFF1",
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

export const InfoLabel = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  float: "left",
  color: "#fff",
}));

export const InfoValue = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  color: "#fff",
  float: "right",
}));

export const InfoWrapper = styled(MuiBox)(({ theme }) => ({
  overflow: "hidden",
  padding: "2px 0",
}));

export const ApproveBox = styled(MuiBox)(({ theme }) => ({
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

export const PoolName = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  color: "#fff",
  textAlign: "left",
  lineHeight: "20px",
}));

export const Fee = styled(Typography)(({ theme }) => ({
  fontSize: "12px",
  color: "#6379A1",
  lineHeight: "16px",
}));

export const ClosePositionError = styled(MuiBox)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  background: "rgba(51, 13, 13, 0.9)",
  border: "1px solid #5A0000",
  borderRadius: "8px",
  padding: "12px 16px 20px",
  margin: "20px 0",
}));

export const ClosePositionErrorMessage = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  lineHeight: "20px",
  color: "#FF8585",
}));

export const WrongNetwork = styled(MuiChip)(({ theme }) => ({
  background: "#6C1313",
  border: "1px solid #811717",
  borderRadius: "8px",
  color: "#FFFFFF",
  fontWeight: 'bold',
  fontSize: '13px'
}));

export const MainBox = styled(MuiBox)(({ theme }) => ({
  background: "linear-gradient(180deg, #071126 0%, #050C1A 100%)",
  flexGrow: 1,
  height: "100vh",
  overflow: "auto",
}));
