import { styled } from "@mui/material/styles";
import { Box, Dialog, Typography } from "@mui/material";

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

export const BaseDialogWrapperLight = styled(BaseDialogWrapper)`
  & .MuiDialog-paper {
    border: 1px solid #3d5580;
    background: #2c4066;
    box-shadow: 0 12px 32px 0 rgba(0, 7, 21, 0.5);
  }
`;

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

export const BaseDialogDescription = styled(Typography)`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #fff;
  margin-bottom: 20px;
  padding: 0;
`;

export const BaseDialogContentWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  background: #132340;
  border-radius: 8px;
  margin: 0;
  padding: 20px;

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
