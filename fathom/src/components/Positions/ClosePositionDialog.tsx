import React, { FC, memo } from "react";
import { DialogContent, Grid, useMediaQuery, useTheme } from "@mui/material";
import { AppDialog } from "components/AppComponents/AppDialog/AppDialog";
import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import useClosePositionContext from "context/closePosition";
import ClosePositionInfo from "components/Positions/ClosePosition/ClosePositionInfo";
import ClosePositionForm from "components/Positions/ClosePosition/ClosePositionForm";
import {
  DividerDefault,
  DividerMobile,
} from "components/Positions/OpenNewPositionDialog";

const ClosePositionDialog: FC = () => {
  const { onClose } = useClosePositionContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={true}
      fullWidth
      maxWidth="md"
      color="primary"
    >
      <AppDialogTitle id="customized-dialog-title" onClose={onClose}>
        Close Position
      </AppDialogTitle>

      <DialogContent>
        <Grid container>
          {!isMobile && (
            <>
              <ClosePositionInfo />
              <DividerDefault
                orientation="vertical"
                flexItem
              ></DividerDefault>
              <ClosePositionForm />
            </>
          )}
          {isMobile && (
            <>
              <ClosePositionForm />
              <DividerMobile></DividerMobile>
              <ClosePositionInfo />
            </>
          )}
        </Grid>
      </DialogContent>
    </AppDialog>
  );
};

export default memo(ClosePositionDialog);
