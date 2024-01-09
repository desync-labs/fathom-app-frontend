import loadable from "@loadable/component";
import { Dispatch, FC, memo } from "react";
import { DialogContent, Grid } from "@mui/material";

import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
const RepayPositionInfo = loadable(
  () => import("../Positions/RepayPosition/RepayPositionInfo")
);
const RepayPositionForm = loadable(
  () => import("../Positions/RepayPosition/RepayPositionForm")
);
import {
  DividerDefault,
  DividerMobile,
} from "components/Positions/OpenNewPositionDialog";

import useRepayPositionContext from "context/repayPosition";
import { IOpenPosition } from "fathom-sdk";
import useSharedContext from "context/shared";

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
  const { isMobile } = useSharedContext();

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
