import * as React from "react";
import { observer } from "mobx-react";
import { useStores } from "stores";
import { useEffect } from "react";
import { Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AlertMessages = observer(() => {
  const { alertStore } = useStores();

  useEffect(() => {
    // Update the document title using the browser API
  }, [alertStore]);

  return (
    <>
      {alertStore.showErrorAlert && (
        <Alert
          severity="error"
          variant="filled"
          sx={{ position: 'fixed', width: '100%', mb: 2 }}
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
        </Alert>
      )}
      {alertStore.showSuccessAlert && (
        <Alert
          severity="success"
          variant="filled"
          sx={{ position: 'fixed', width: '100%', mb: 2 }}
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
        </Alert>
      )}
    </>
  );
});

export default AlertMessages;
