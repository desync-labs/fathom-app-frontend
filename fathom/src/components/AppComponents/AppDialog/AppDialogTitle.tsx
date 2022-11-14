import React, { FC } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { DialogTitleProps } from "../../Positions/ClosePositionDialog";
import { styled } from "@mui/material/styles";
import { DialogTitle as MuiDialogTitle } from "@mui/material";

export const AppDialogTitleWrapper = styled(MuiDialogTitle)`
  font-weight: bold;
  font-size: 20px;
  line-height: 24px;
  color: #fff;
  padding: 20px 32px 15px 32px;
  margin: 0;
`

export const AppDialogCloseIcon = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: 8,
  top: 8,
  color: theme.palette.grey[500],
}));



export const AppDialogTitle: FC<DialogTitleProps> = ({
  children,
  onClose,
  ...other
}) => {
  return (
    <AppDialogTitleWrapper {...other}>
      {children}
      {onClose ? (
        <AppDialogCloseIcon aria-label="close" onClick={onClose}>
          <CloseIcon />
        </AppDialogCloseIcon>
      ) : null}
    </AppDialogTitleWrapper>
  );
};
