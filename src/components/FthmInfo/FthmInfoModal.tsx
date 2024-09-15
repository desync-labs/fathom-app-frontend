import { Dispatch, FC, ReactNode, SetStateAction } from "react";
import { styled } from "@mui/material/styles";
import { BaseDialogWrapper } from "components/Base/Dialog/StyledDialog";

type FthmInfoModalProps = {
  open: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
};

const FthmInfoModalDialog = styled(BaseDialogWrapper)`
  .MuiPaper-root {
    width: 500px;
    ${({ theme }) => theme.breakpoints.down("sm")} {
      max-height: none;
      height: auto;
      border-radius: 16px;
    }
  }
`;

const FthmInfoModal: FC<FthmInfoModalProps> = ({ open, onClose, children }) => {
  return (
    <FthmInfoModalDialog onClose={onClose} open={open}>
      {children}
    </FthmInfoModalDialog>
  );
};

export default FthmInfoModal;
