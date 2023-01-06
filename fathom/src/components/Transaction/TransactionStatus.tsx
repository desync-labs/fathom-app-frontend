import { observer } from "mobx-react";
import { Alert, AlertTitle, LinearProgress, Typography } from "@mui/material";
import { useStores } from "stores";
import truncateEthAddress from "truncate-eth-address";
import { styled } from "@mui/material/styles";
import { useWeb3React } from "@web3-react/core";
import { getTxUrl } from "utils/exporer";
import { ChainId } from "connectors/networks";
import { FC } from "react";

const AlertMessage = styled(Alert, {
  shouldForwardProp: (prop) => prop !== "scroll",
})<{ scroll: number }>`
  position: fixed;
  width: 100%;
  margin-bottom: 2px;
  z-index: 1000;
  top: ${({ scroll }) => (scroll > 65 ? "0" : `${65 - scroll}px`)};
  ${({ theme }) => theme.breakpoints.down("sm")} {
    z-index: 1301;
  }
`;

type TransactionStatusPropsType = {
  scroll: number;
};

const TransactionStatus: FC<TransactionStatusPropsType> = observer(
  ({ scroll }) => {
    const { transactionStore } = useStores();
    const { chainId } = useWeb3React();

    return (
      <>
        {transactionStore.transactions.map((transaction, idx) => (
          <AlertMessage
            scroll={scroll}
            severity="info"
            variant="filled"
            key={idx}
          >
            <AlertTitle>{transaction.title}</AlertTitle>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              {transaction.message}{" "}
              <strong>
                <a
                  target="_blank"
                  href={getTxUrl(transaction.hash, chainId as ChainId)}
                  rel="noreferrer"
                >
                  [{truncateEthAddress(transaction.hash)}]
                </a>
              </strong>
            </Typography>
            <LinearProgress />
          </AlertMessage>
        ))}
      </>
    );
  }
);

export default TransactionStatus;
