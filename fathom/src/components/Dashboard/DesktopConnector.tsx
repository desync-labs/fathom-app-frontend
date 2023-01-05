import { AppDialog } from "components/AppComponents/AppDialog/AppDialog";
import React, { FC, useCallback } from "react";
import { DialogContent } from "@mui/material";
import MetamaskSrc from "assets/svg/metamask.svg";
import WalletConnect from "assets/svg/wallet-connect.svg";
import { styled } from "@mui/material/styles";
import useConnector from "context/connector";

type DesktopConnectorPropsType = {
  onClose: () => void;
};

const Connector = styled("button")`
  background-color: #061023;
  padding: 1rem;
  outline: none;
  border-radius: 12px;
  width: 100% !important;
  border: none;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 7px;
  color: #fff;
  margin-bottom: 10px;
  cursor: pointer;
  height: 56px;

  img {
    width: 24px;
  }
`;

const DesktopConnector: FC<DesktopConnectorPropsType> = ({ onClose }) => {
  const { connectWalletConnect, connectMetamask } = useConnector();

  const walletConnectConnect = useCallback(() => {
    connectWalletConnect();
    onClose();
  }, [onClose, connectWalletConnect]);

  return (
    <AppDialog
      onClose={onClose}
      open={true}
      sx={{ "& .MuiPaper-root": { width: "500px" } }}
    >
      <DialogContent>
        <Connector onClick={connectMetamask}>
          <img src={MetamaskSrc} alt={"metamask"} />
          Metamask
        </Connector>
        <Connector onClick={walletConnectConnect}>
          <img src={WalletConnect} alt={"wallet-connect"} />
          Wallet Connect
        </Connector>
      </DialogContent>
    </AppDialog>
  );
};

export default DesktopConnector;
