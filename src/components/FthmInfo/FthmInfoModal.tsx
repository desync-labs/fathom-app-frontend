import { Dispatch, FC, ReactNode, SetStateAction } from "react";
import { AppDialog } from "components/AppComponents/AppDialog/AppDialog";
import { styled } from "@mui/material/styles";

type FthmInfoModalProps = {
  open: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
};

const FthmInfoModalDialog = styled(AppDialog)`
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
