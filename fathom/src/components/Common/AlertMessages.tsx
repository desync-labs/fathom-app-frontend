import * as React from "react";
import { observer } from "mobx-react";
import { useStores } from "stores";
import { Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { FC } from "react";

const AlertMessage = styled(Alert, {
  shouldForwardProp: (prop) => prop !== "scroll",
})<{ scroll: number }>`
  position: fixed;
  width: 100%;
  margin-bottom: 2px;
  z-index: 1000;
  top: ${({ scroll }) => (scroll > 65 ? "0" : `${65 - scroll}px`)};
`;

type AlertMessagesPropsType = {
  scroll: number
}

const AlertMessages: FC<AlertMessagesPropsType> = observer(({ scroll }) => {
  const { alertStore } = useStores();

  return (
    <>
      {alertStore.showErrorAlert && (
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
          scroll={scroll}
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
