import { styled } from "@mui/material/styles";
import {
  Dialog as MuiDialog,
} from "@mui/material";

export const AppDialog = styled(
  MuiDialog,
  {}
)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiPaper-root": {
    background: "#1D2D49",
    border: "1px solid #324567",
    borderRadius: "16px",
    width: "1000px",
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  color: "#9FADC6",
  fontSize: "14px",
  lineHeight: "20px",
}));
