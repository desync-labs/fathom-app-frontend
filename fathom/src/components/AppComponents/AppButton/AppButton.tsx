import { styled } from "@mui/material/styles";
import { Box, IconButton as MuiButton } from "@mui/material";
import { IconButtonProps as MuiIconButtonProps } from "@mui/material/IconButton/IconButton";

interface ToggleDrawerButtonProps extends MuiIconButtonProps {
  open?: boolean;
}

export const ToggleDrawerButton = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== "open",
})<ToggleDrawerButtonProps>(({ theme, open }) => ({
  color: "#000",
  width: "20px",
  height: "20px",
  borderRadius: "20px",
  background: open ? "#808084" : "#3E3F45",
  padding: 0,
  position: "absolute",
  right: "-10px",
  "&:hover": { background: open ? "#3E3F45" : "#808084" },
}));

export const ButtonPrimary = styled(
  MuiButton,
  {}
)<ToggleDrawerButtonProps>(({ theme }) => ({
  borderRadius: "8px",
  background: "linear-gradient(104.04deg, #B3FFF9 0%, #00DBCB 100%)",
  padding: "8, 12, 8, 12",
  fontSize: "13px",
  lineHeight: "16px",
  fontWeight: "bold",
  color: "#00332F",
  border: "1px solid #B3FFF9",
  height: "40px",
  cursor: "pointer",
  "&:hover": {
    background: "transparent",
    color: "#B3FFF9",
    border: "1px solid #B3FFF9",
    svg: {
      color: "#B3FFF9",
    },
  },
  "&:disabled": {
    color: "gray",
    background: "transparent",
    borderColor: "gray",
    cursor: "not-allowed !important",
    pointerEvents: "all !important",
  },
}));

export const ButtonSecondary = styled(
  MuiButton,
  {}
)(({ theme }) => ({
  color: "#43FFF1",
  fontWeight: "bold",
  fontSize: "15px",
  lineHeight: "20px",
  padding: "8px 16px",
  gap: "8px",
  border: "1px solid #009E92",
  borderRadius: "8px",
  height: "40px",
  "&:hover": {
    background: "transparent",
    color: "#B3FFF9",
    border: "1px solid #B3FFF9",
    svg: {
      color: "#B3FFF9",
    },
  },
  "&:disabled": {
    color: "gray",
    background: "transparent",
    borderColor: "gray",
    cursor: "not-allowed !important",
    pointerEvents: "all !important",
  },
}));

export const OpenPositionButton = styled(
  MuiButton,
  {}
)<ToggleDrawerButtonProps>(({ theme, open }) => ({
  borderRadius: "8px",
  background: "linear-gradient(104.04deg, #B3FFF9 0%, #00DBCB 100%)",
  padding: "8, 12, 8, 12",
  height: "32px",
  fontSize: "13px",
  lineHeight: "16px",
  fontWeight: "bold",
  color: "#00332F",
  border: "1px solid #B3FFF9",
  marginRight: "25px",
  "&:hover": {
    background: "transparent",
    color: "#B3FFF9",
    border: "1px solid #B3FFF9",
    pointerEvents: "all !important",
    cursor: "pointer",
    svg: {
      color: "#B3FFF9",
    },
  },
}));

export const ClosePositionButton = styled(
  MuiButton,
  {}
)<ToggleDrawerButtonProps>(({ theme, open }) => ({
  border: "0.7px solid #009E92",
  borderRadius: "8px",
  background: "transparent",
  padding: "8px 12px",
  color: "#B3FFF9",
  fontSize: "13px",
  lineHeight: "16px",
  height: "32px",
  minWidth: "118px",
  "&:hover": {
    background: "transparent",
    color: "#B3FFF9",
    border: "1px solid #B3FFF9",
    svg: {
      color: "#B3FFF9",
    },
  },
}));

export const MaxButton = styled(
  MuiButton,
  {}
)(({ theme }) => ({
  background: "rgba(50, 69, 103, 0.3)",
  borderRadius: "6px",
  justifyContent: "center",
  alignItems: "center",
  padding: "4px 8px",
  gap: "8px",
  color: "#fff",
  fontSize: "14px",
  lineHeight: "20px",
  position: "absolute",
  top: "28px",
  right: "7px",
  cursor: "pointer",
}));

export const ApproveButton = styled(
  MuiButton,
  {}
)(({ theme }) => ({
  color: "#00332F",
  fontWeight: "bold",
  fontSize: "13px",
  lineHeight: "16px",
  background: "linear-gradient(104.04deg, #B3FFF9 0%, #00DBCB 100%)",
  border: "1px solid #B3FFF9",
  borderRadius: "8px",
  marginLeft: "33px",
  marginTop: "15px",
  minWidth: "80px",
  height: "28px",
}));

export const OpenPositionsButtonsWrapper = styled(
  Box,
  {}
)(({ theme }) => ({
  display: "flex",
  gap: "10px",
  position: "absolute",
  right: 0,
  bottom: 0,
}));

export const ClosePositionRepayTypeWrapper = styled(
  Box,
  {}
)(({ theme }) => ({
  marginBottom: "20px",
}));

export const RepayTypeButton = styled(MuiButton)(({ theme }) => ({
  border: "1px solid #6987B8",
  borderRadius: "8px",
  alignItems: "center",
  height: "40px",
  width: "49%",
  color: "#FFF",
  fontSize: "15px",
  lineHeight: "20px",
  fontWeight: "bold",
  "&.active": {
    background: "#4F658C",
    border: "1px solid #6379A1",
  },
}));
