import { styled } from "@mui/material/styles";
import {
  Box,
  Dialog as MuiDialog
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

export const DialogContentWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 20px 15px 30px 15px;
  background: #131F35;
  border-radius: 8px;
  padding: 20px 0;
  
  > div {
    font-size: 18px;
    line-height: 22px;
  }
  
  .amount {
    font-weight: 600;
    font-size: 36px;
    line-height: 40px;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 7px;

    span {
      font-weight: 500;
      font-size: 20px;
      line-height: 24px;
    }
  }
`;
