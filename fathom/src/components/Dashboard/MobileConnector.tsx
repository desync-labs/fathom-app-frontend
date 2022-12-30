import React, { Dispatch, FC, useCallback } from "react";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

import MetamaskSrc from "assets/svg/metamask.svg";
import WalletConnect from "assets/svg/wallet-connect.svg";
import useConnector from "context/connector";

const MobileConnectorWrapper = styled(Box)`
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 200px;
  background: #131f35;
  z-index: 1000;
  padding-left: 12px;
  padding-right: 12px;
  padding-top: 20px;
  border-top: 1px solid #192c46;
`;

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

  img {
    max-width: 24px;
    max-height: 24px;
  }
`;

type MobileConnectorPropsType = {
  setOpenMobileConnector: Dispatch<boolean>;
};

const MobileConnector: FC<MobileConnectorPropsType> = ({
  setOpenMobileConnector,
}) => {
  const { connectWalletConnect } = useConnector();

  const walletConnectConnect = useCallback(() => {
    connectWalletConnect();
    setOpenMobileConnector(false);
  }, [setOpenMobileConnector, connectWalletConnect]);

  return (
    <MobileConnectorWrapper>
      <Connector>
        <img src={MetamaskSrc} alt={"metamask"} />
        Metamask
      </Connector>
      <Connector onClick={walletConnectConnect}>
        <img src={WalletConnect} alt={"wallet-connect"} />
        Wallet Connect
      </Connector>
    </MobileConnectorWrapper>
  );
};

export default MobileConnector;
