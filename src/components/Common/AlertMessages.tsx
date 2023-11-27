import * as React from "react";
import { Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { FC } from "react";
import useAlertAndTransactionContext from "context/alertAndTransaction";

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
