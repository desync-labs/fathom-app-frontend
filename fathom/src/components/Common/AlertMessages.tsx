import * as React from 'react';
import { observer } from 'mobx-react';
import { useStores } from '../../stores';
import { useEffect } from 'react';
import { Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';



const AlertMessages = observer(() => {
    let rootStore = useStores()
  
    useEffect(() => {
      // Update the document title using the browser API
    },[rootStore.alertStore]);

  return (
        <div>
            {rootStore.alertStore.showErrorAlert && 
            <Alert severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  rootStore.alertStore.setShowErrorAlert(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
            >
              {rootStore.alertStore.errorAlertMessage }
            </Alert>
          }
          {rootStore.alertStore.showSuccessAlert && 
            <Alert severity="success"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  rootStore.alertStore.setShowSuccessAlert(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}

            >
                {rootStore.alertStore.successAlertMessage}
            </Alert>
          }
        </div>
  );
})

export default AlertMessages;
