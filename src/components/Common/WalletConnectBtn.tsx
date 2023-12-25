import { Button, styled } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import useConnector from "context/connector";

export const WalletButton = styled(Button)`
  border-radius: 8px;
  background: linear-gradient(104.04deg, #b3fff9 0%, #00dbcb 100%);
  text-transform: capitalize;
  font-size: 13px;
  line-height: 16px;
  font-weight: bold;
  color: #00332f;
  border: 1px solid #b3fff9;
  height: 40px;
  padding: 8px 12px 8px 12px;
  &:hover {
    background: transparent;
    color: #b3fff9;
    border: 1px solid #b3fff9;
    cursor: pointer;
    pointer-events: all !important;
    svg {
      color: #b3fff9;
    }
  }
`;

type WalletConnectBtnPropsTypes = {
  fullwidth?: boolean | undefined;
};

const WalletConnectBtn = ({ fullwidth }: WalletConnectBtnPropsTypes) => {
  const { openConnectorMenu } = useConnector();
  return (
    <WalletButton
      onClick={openConnectorMenu}
      startIcon={<AccountBalanceWalletIcon />}
      fullWidth={fullwidth}
    >
      Connect Wallet
    </WalletButton>
  );
};

export default WalletConnectBtn;
