import { FC } from "react";
import { Alert, AlertTitle, LinearProgress, Typography } from "@mui/material";
import truncateEthAddress from "truncate-eth-address";
import { styled } from "@mui/material/styles";
import { getTxUrl } from "utils/explorer";
import { ChainId } from "connectors/networks";
import useConnector from "context/connector";
import useAlertAndTransactionContext from "context/alertAndTransaction";

const AlertMessage = styled(Alert, {
  shouldForwardProp: (prop) => prop !== "scroll",
})<{ scroll: number }>`
  position: fixed;
  width: 100%;
  top: ${({ scroll }) => (scroll > 65 ? "0" : `${65 - scroll}px`)};
  background-color: #3e5ab2;
  z-index: 1301;

  &.MuiAlert-root {
    border-radius: 6px;
    padding: 6px 16px;
    margin-top: 0;
    margin-bottom: 0;
  }

  & .MuiAlert-message {
    color: #fff;
    font-weight: 500;
    font-size: 0.875rem;
    line-height: 1.43;
    padding: 8px 0;
  }
  .MuiAlert-icon {
    margin-right: 12px;
    padding: 7px 0;
    color: #fff;
    opacity: 1;
    .MuiSvgIcon-root {
      font-size: 22px;
    }
  }
  .MuiButton-text {
    font-weight: 500;
    text-decoration: underline;
    padding: 0;
    margin: 0;
    min-width: unset;
    &:hover {
      text-decoration: none;
      background: transparent;
    }
  }
  & a {
    color: #5a81ff;
    font-weight: 700;
    text-decoration: none;
    &:hover {
      text-decoration: none;
    }
  }
`;

type TransactionStatusPropsType = {
  scroll: number;
};

const TransactionStatus: FC<TransactionStatusPropsType> = ({ scroll }) => {
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
          <AlertTitle sx={{ fontSize: "1rem" }}>{transaction.title}</AlertTitle>
          <Typography
            color="rgba(255, 255, 255, 0.7)"
            sx={{ fontSize: "1rem", flex: 1 }}
          >
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
