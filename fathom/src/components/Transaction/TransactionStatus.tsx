import { observer } from "mobx-react";
import { Alert, AlertTitle, LinearProgress, Typography } from "@mui/material";
import { useStores } from "../../stores";
import truncateEthAddress from "truncate-eth-address";
import { useWeb3React } from "@web3-react/core";
import { getEtherscanLink } from "../../config/network";
import { useCallback } from "react";

const TransactionStatus = observer(() => {
  const transactionStore = useStores().transactionStore;
  const { chainId } = useWeb3React();

  const getTxUrl = useCallback((txHash: string) => {
    return getEtherscanLink(chainId!, txHash, "transaction")
  }, [chainId]);

  return (
    <>
      {transactionStore.transactions.map((transaction, idx) => (
        <Alert severity="info" variant="filled">
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
