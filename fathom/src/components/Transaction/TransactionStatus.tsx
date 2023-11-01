import { FC } from "react";
import {
  Alert,
  AlertTitle,
  LinearProgress,
  Typography
} from "@mui/material";
import truncateEthAddress from "truncate-eth-address";
import { styled } from "@mui/material/styles";
import { getTxUrl } from "utils/explorer";
import { ChainId } from "connectors/networks";
import useConnector from "context/connector";
import useAlertAndTransactionContext from "context/alertAndTransaction";

const AlertMessage = styled(Alert, {
  shouldForwardProp: (prop) => prop !== "scroll"
})<{ scroll: number }>`
  position: fixed;
  width: 100%;
  margin-bottom: 2px;
  top: ${({ scroll }) => (scroll > 65 ? "0" : `${65 - scroll}px`)};
  z-index: 1301;
`;

type TransactionStatusPropsType = {
  scroll: number;
};

const TransactionStatus: FC<TransactionStatusPropsType> =
  ({ scroll }) => {
    const { transactions } = useAlertAndTransactionContext();
    const { chainId } = useConnector();

    return (
      <>
        {transactions.map((transaction, idx) => (
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
  };

export default TransactionStatus;
