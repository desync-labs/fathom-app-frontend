import { styled } from "@mui/material/styles";
import { Dialog as MuiDialog } from "@mui/material";

export const AppDialog = styled(
  MuiDialog,
  {}
)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiPaper-root":  {
    background: "#101D32",
    border: "1px solid #101D32",
    borderRadius: "8px",
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));