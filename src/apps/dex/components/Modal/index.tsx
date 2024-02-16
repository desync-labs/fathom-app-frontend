import { FC, ReactNode } from "react";
import { styled } from "@mui/material";
import { AppDialog } from "components/AppComponents/AppDialog/AppDialog";

const AppDialogStyled = styled(AppDialog)<{
  minHeight?: number;
  maxHeight?: number;
  isFixedHeight?: boolean;
}>`
  .MuiDialog-paper {
    height: ${({ isFixedHeight }) => (isFixedHeight ? "100%" : "auto")};
    min-height: ${({ minHeight }) => (minHeight ? `${minHeight}vh` : "unset")};
    max-height: ${({ maxHeight }) => (maxHeight ? `${maxHeight}vh` : "unset")};
  }

  ${({ theme }) => theme.breakpoints.down("md")} {
    .MuiDialog-paper {
      height: 100dvh;
      min-height: unset;
      max-height: unset;
    }
  }
`;

interface ModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  minHeight?: number;
  maxHeight?: number;
  isFixedHeight?: boolean;
  children?: ReactNode;
}

const Modal: FC<ModalProps> = ({
  isOpen,
  onDismiss,
  minHeight,
  maxHeight = 90,
  isFixedHeight = false,
  children,
}) => {
  return (
    <AppDialogStyled
      onClose={onDismiss}
      aria-labelledby="customized-dialog-title"
      maxWidth="xs"
      minHeight={minHeight}
      maxHeight={maxHeight}
      isFixedHeight={isFixedHeight}
      open={isOpen}
      color="primary"
    >
      {children}
    </AppDialogStyled>
  );
};

export default Modal;
