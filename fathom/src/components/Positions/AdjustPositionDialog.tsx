import React, { FC, memo } from "react";
import {
  Grid,
  DialogContent,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AppDialog } from "components/AppComponents/AppDialog/AppDialog";
import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import useAdjustPositionContext from "context/adjustPosition";
import AdjustPositionInfo from "components/Positions/AdjustPosition/AdjustPositionInfo";
import AdjustPositionForm from "components/Positions/AdjustPosition/AdjustPositionForm";
import { styled } from "@mui/material/styles";

export const DividerMobile = styled(Divider)`
  width: 100%;
  height: 1px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

export const DividerDefault = styled(Divider)`
  margin: 10px 0 0 0;
`;

const AdjustPositionDialog: FC = () => {
  const { onClose } = useAdjustPositionContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      maxWidth="md"
      open={true}
      color="primary"
    >
      <AppDialogTitle id="customized-dialog-title" onClose={onClose}>
        Adjust Position
      </AppDialogTitle>
      <DialogContent>
        <Grid container>
          {!isMobile && (
            <>
              <AdjustPositionInfo />
              <DividerDefault orientation="vertical" flexItem></DividerDefault>
              <AdjustPositionForm />
            </>
          )}
          {isMobile && (
            <>
              <AdjustPositionForm />
              <DividerMobile></DividerMobile>
              <AdjustPositionInfo />
            </>
          )}
        </Grid>
      </DialogContent>
    </AppDialog>
  );
};

export default memo(AdjustPositionDialog);
