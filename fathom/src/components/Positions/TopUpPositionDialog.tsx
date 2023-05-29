import React, {
  FC,
  memo
} from "react";
import {
  Grid,
  DialogContent,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import { ClosePositionDialogPropsType } from "components/Positions/RepayPositionDialog";
import TopUpPositionInfo from "components/Positions/TopUpPosition/TopUpPositionInfo";
import TopUpPositionForm from "components/Positions/TopUpPosition/TopUpPositionForm";

import useAdjustPositionContext from "context/topUpPosition";

export const DividerMobile = styled(Divider)`
  width: 100%;
  height: 1px;
  margin-top: 20px;
  margin-bottom: 20px;
`;

export const DividerDefault = styled(Divider)`
  margin: 10px 0 0 0;
`;

const TopUpPositionDialog: FC<ClosePositionDialogPropsType> = ({
  topUpPosition,
  closePosition,
  setTopUpPosition,
  setClosePosition,
}) => {
  const { onClose } = useAdjustPositionContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <AppDialogTitle id="customized-dialog-title" onClose={onClose}>
        Top Up Position
      </AppDialogTitle>
      <DialogContent>
        <Grid container>
          {!isMobile && (
            <>
              <TopUpPositionInfo />
              <DividerDefault orientation="vertical" flexItem></DividerDefault>
              <TopUpPositionForm
                topUpPosition={topUpPosition}
                closePosition={closePosition}
                setTopUpPosition={setTopUpPosition}
                setClosePosition={setClosePosition}
              />
            </>
          )}
          {isMobile && (
            <>
              <TopUpPositionForm
                topUpPosition={topUpPosition}
                closePosition={closePosition}
                setTopUpPosition={setTopUpPosition}
                setClosePosition={setClosePosition}
              />
              <DividerMobile></DividerMobile>
              <TopUpPositionInfo />
            </>
          )}
        </Grid>
      </DialogContent>
    </>
  );
};

export default memo(TopUpPositionDialog);
