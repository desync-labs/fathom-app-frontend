import React, { Dispatch, FC, memo } from "react";
import { DialogContent, Grid, useMediaQuery, useTheme } from "@mui/material";

import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import RepayPositionInfo from "components/Positions/RepayPosition/RepayPositionInfo";
import RepayPositionForm from "components/Positions/RepayPosition/RepayPositionForm";
import {
  DividerDefault,
  DividerMobile,
} from "components/Positions/OpenNewPositionDialog";

import useRepayPositionContext from "context/repayPosition";
import IOpenPosition from "services/interfaces/IOpenPosition";

export type ClosePositionDialogPropsType = {
  topUpPosition: IOpenPosition | undefined;
  closePosition: IOpenPosition | undefined;
  setTopUpPosition: Dispatch<IOpenPosition | undefined>;
  setClosePosition: Dispatch<IOpenPosition | undefined>;
};

const RepayPositionDialog: FC<ClosePositionDialogPropsType> = ({
  topUpPosition,
  closePosition,
  setTopUpPosition,
  setClosePosition,
}) => {
  const { onClose } = useRepayPositionContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <AppDialogTitle id="customized-dialog-title" onClose={onClose}>
        Repay Position
      </AppDialogTitle>

      <DialogContent>
        <Grid container>
          {!isMobile && (
            <>
              <RepayPositionInfo />
              <DividerDefault orientation="vertical" flexItem></DividerDefault>
              <RepayPositionForm
                topUpPosition={topUpPosition}
                closePosition={closePosition}
                setTopUpPosition={setTopUpPosition}
                setClosePosition={setClosePosition}
              />
            </>
          )}
          {isMobile && (
            <>
              <RepayPositionForm
                topUpPosition={topUpPosition}
                closePosition={closePosition}
                setTopUpPosition={setTopUpPosition}
                setClosePosition={setClosePosition}
              />
              <DividerMobile></DividerMobile>
              <RepayPositionInfo />
            </>
          )}
        </Grid>
      </DialogContent>
    </>
  );
};

export default memo(RepayPositionDialog);
