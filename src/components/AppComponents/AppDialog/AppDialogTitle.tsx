import { FC, ReactNode } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { DialogTitle as MuiDialogTitle, SxProps } from "@mui/material";
import { Theme } from "@mui/system";

export const AppDialogTitleWrapper = styled(MuiDialogTitle)`
  font-weight: bold;
  font-size: 20px;
  line-height: 24px;
  color: #fff;
  padding: 20px 32px 15px 32px;
  margin: 0;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding-left: 15px;
  }
`;

export const AppDialogCloseIcon = styled(IconButton)`
  position: absolute;
  right: 8px;
  top: 8px;
  color: #fff;
`;

export interface DialogTitleProps {
  id: string;
  children?: ReactNode;
  onClose: () => void;
  sx?: SxProps<Theme>;
  sxCloseIcon?: SxProps<Theme>;
}

export const AppDialogTitle: FC<DialogTitleProps> = ({
  children,
  onClose,
  sxCloseIcon,
  ...other
}) => {
  return (
    <AppDialogTitleWrapper {...other}>
      {children}
      {onClose ? (
        <AppDialogCloseIcon
          aria-label="close"
          onClick={onClose}
          sx={sxCloseIcon}
        >
          <CloseIcon />
        </AppDialogCloseIcon>
      ) : null}
    </AppDialogTitleWrapper>
  );
};
