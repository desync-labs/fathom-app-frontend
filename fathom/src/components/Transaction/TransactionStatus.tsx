import { observer } from "mobx-react";
import { Alert, AlertTitle, LinearProgress, Typography } from "@mui/material";
import { useStores } from "stores";
import truncateEthAddress from "truncate-eth-address";
import { styled } from "@mui/material/styles";
import { useWeb3React } from "@web3-react/core";
import { getTxUrl } from "utils/exporer";
import { ChainId } from "connectors/networks";

const AlertMessage = styled(Alert)`
  position: fixed;
  width: 100%;
  margin-bottom: 2px;
  z-index: 1000;
`;

const TransactionStatus = observer(() => {
  const { transactionStore } = useStores();
  const { chainId } = useWeb3React();

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
});

export default TransactionStatus;
