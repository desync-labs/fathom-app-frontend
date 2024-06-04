import { Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { FC } from "react";
import useAlertAndTransactionContext from "context/alertAndTransaction";

const AlertMessage = styled(Alert, {
  shouldForwardProp: (prop) => prop !== "scroll",
})<{ scroll: number }>`
  position: fixed;
  align-items: flex-start;
  width: 100%;
  top: ${({ scroll }) => (scroll > 65 ? "0" : `${65 - scroll}px`)};
  border-radius: 4px;
  border: none;
  z-index: 1000;

  &.MuiAlert-root {
    padding: 6px 16px;
    margin-top: 0;
    margin-bottom: 0;
  }

  &.MuiAlert-filledSuccess {
    background-color: #2a721c;
  }

  &.MuiAlert-filledError {
    background-color: #9a2a2a;
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
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    z-index: 1301;
  }
`;

type AlertMessagesPropsType = {
  scroll: number;
};

const AlertMessages: FC<AlertMessagesPropsType> = ({ scroll }) => {
  const {
    showErrorAlert,
    showSuccessAlert,
    successAlertMessage,
    errorAlertMessage,
    setShowSuccessAlert,
    setShowErrorAlert,
  } = useAlertAndTransactionContext();

  return (
    <>
      {showErrorAlert && (
        <AlertMessage
          severity="error"
          variant="filled"
          scroll={scroll}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setShowErrorAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {errorAlertMessage}
        </AlertMessage>
      )}
      {showSuccessAlert && (
        <AlertMessage
          severity="success"
          scroll={scroll}
          variant="filled"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setShowSuccessAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {successAlertMessage}
        </AlertMessage>
      )}
    </>
  );
};

export default AlertMessages;
