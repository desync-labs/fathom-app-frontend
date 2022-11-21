import { observer } from "mobx-react";
import { Alert, AlertTitle, LinearProgress, Typography } from "@mui/material";
import { useStores } from "../../stores";
import truncateEthAddress from "truncate-eth-address";
import { Constants } from "../../helpers/Constants";

const TransactionStatus = observer(() => {
  let { transactionStore } = useStores();
  let rootStore = useStores();

  const getTxUrl = (txHash: string) => {
    if (rootStore.chainId === Constants.DEFAULT_CHAIN_ID) {
      return `${Constants.APOTHEM_BLOCK_EXPLORER_URL}${txHash}`;
    } else {
      return `${Constants.GOERLI_BLOCK_EXPLORER_URL}${txHash}`
    }
  };

  return (
    <>
      {transactionStore.transactions.map((transaction, idx) => (
        <Alert severity="info" variant="filled" key={idx}>
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
        </Alert>
      ))}
    </>
  );
});

export default TransactionStatus;
