import { FC, memo } from "react";
import { Grid, DialogContent, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";

import { AppDialog } from "components/AppComponents/AppDialog/AppDialog";
import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";

import OpenPositionInfo from "components/Positions/OpenPosition/OpenPositionInfo";
import OpenPositionForm from "components/Positions/OpenPosition/OpenPositionForm";

import useOpenPositionContext from "context/openPosition";
import useSharedContext from "context/shared";

export const DividerMobile = styled(Divider)`
  width: 100%;
  height: 1px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

export const DividerDefault = styled(Divider)`
  margin: 10px 0 0 0;
`;

const OpenNewPositionDialog: FC = () => {
  const { onClose } = useOpenPositionContext();
  const { isMobile } = useSharedContext();

  return (
    <AppDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      maxWidth="md"
      open={true}
      color="primary"
    >
      <AppDialogTitle id="customized-dialog-title" onClose={onClose}>
        Open New Position
      </AppDialogTitle>
      <DialogContent>
        <Grid container>
          {!isMobile && (
            <>
              <OpenPositionInfo />
              <DividerDefault orientation="vertical" flexItem></DividerDefault>
              <OpenPositionForm />
            </>
          )}
          {isMobile && (
            <>
              <OpenPositionForm />
              <DividerMobile></DividerMobile>
              <OpenPositionInfo />
            </>
          )}
        </Grid>
      </DialogContent>
    </AppDialog>
  );
};

export default memo(OpenNewPositionDialog);
