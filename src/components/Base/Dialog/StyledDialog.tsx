import { styled } from "@mui/material/styles";
import { Box, Dialog } from "@mui/material";

export const BaseDialogWrapper = styled(
  Dialog,
  {}
)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: "0 24px 24px",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "0 16px 24px",
    },
  },
  "& .MuiDivider-root": {
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  "& .MuiDialog-paper": {
    borderRadius: "16px",
    border: "1px solid #2c4066",
    background: "#132340",
    [theme.breakpoints.down("sm")]: {
      width: "100vw",
      height: "calc(var(--vh, 1vh) * 100)",
      maxWidth: "100vw",
      maxHeight: "100vh",
      borderRadius: "0",
      margin: "0",
    },
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  color: "#9FADC6",
  fontSize: "14px",
  lineHeight: "20px",
}));

export const BaseDialogNavWrapper = styled(Box)`
  width: fit-content;
  border-bottom: 1.5px solid #1d2d49;
  display: flex;
  align-items: center;
  padding: 0;
  margin-top: -10px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: fit-content;
    padding: 0;

    & button {
      font-size: 16px;
    }
  }
`;
