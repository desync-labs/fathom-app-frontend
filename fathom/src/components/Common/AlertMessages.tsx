import * as React from "react";
import { observer } from "mobx-react";
import { useStores } from "stores";
import { Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";

const AlertMessage = styled(Alert)`
  position: fixed;
  width: 100%;
  margin-bottom: 2px;
  z-index: 1000;
`;

const AlertMessages = observer(() => {
  const { alertStore } = useStores();

  return (
    <>
      {alertStore.showErrorAlert && (
        <AlertMessage
          severity="error"
          variant="filled"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                alertStore.setShowErrorAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {alertStore.errorAlertMessage}
        </AlertMessage>
      )}
      {alertStore.showSuccessAlert && (
        <AlertMessage
          severity="success"
          variant="filled"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                alertStore.setShowSuccessAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {alertStore.successAlertMessage}
        </AlertMessage>
      )}
    </>
  );
});

export default AlertMessages;
