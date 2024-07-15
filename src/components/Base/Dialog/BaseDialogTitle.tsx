import { FC, ReactNode } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { DialogTitle as MuiDialogTitle, SxProps } from "@mui/material";
import { Theme } from "@mui/system";

export const BaseDialogTitleWrapper = styled(MuiDialogTitle)`
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  color: #fff;
  margin: 0;
  padding: 24px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 16px;
    padding: 24px 24px 20px 24px;
  }
`;

export const BaseDialogCloseIcon = styled(IconButton)`
  position: absolute;
  right: 16px;
  top: 16px;
  color: #fff;
`;

export interface DialogTitleProps {
  id: string;
  children?: ReactNode;
  onClose: () => void;
  sx?: SxProps<Theme>;
  sxCloseIcon?: SxProps<Theme>;
}

export const BaseDialogTitle: FC<DialogTitleProps> = ({
  children,
  onClose,
  sxCloseIcon,
  ...other
}) => {
  return (
    <BaseDialogTitleWrapper {...other}>
      {children}
      {onClose ? (
        <BaseDialogCloseIcon
          aria-label="close"
          onClick={onClose}
          sx={sxCloseIcon}
        >
          <CloseIcon />
        </BaseDialogCloseIcon>
      ) : null}
    </BaseDialogTitleWrapper>
  );
};
