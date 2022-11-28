import { observer } from "mobx-react";
import { Alert, AlertTitle, LinearProgress, Typography } from "@mui/material";
import { useStores } from "stores";
import truncateEthAddress from "truncate-eth-address";
import { ChainId, EXPLORERS } from "connectors/networks";
import { styled } from "@mui/material/styles";

const AlertMessage = styled(Alert)`
  position: fixed;
  width: 100%;
  margin-bottom: 2px;
  z-index: 1000;
`;

const TransactionStatus = observer(() => {
  let { transactionStore } = useStores();
  let rootStore = useStores();

  const getTxUrl = (txHash: string) => {
    if (rootStore.chainId in EXPLORERS) {
      return `${EXPLORERS[rootStore.chainId as ChainId]}${txHash}`;
    }
    return "";
  };

  return (
    <>
      {transactionStore.transactions.map((transaction, idx) => (
        <AlertMessage severity="info" variant="filled" key={idx}>
          <AlertTitle>{transaction.title}</AlertTitle>
          <Typography color="text.secondary" sx={{ flex: 1 }}>
            {transaction.message}{" "}
            <strong>
              <a
                target="_blank"
                href={getTxUrl(transaction.hash)}
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
});

export default TransactionStatus;
