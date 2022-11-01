import { observer } from "mobx-react";
import { CircularProgress, Grid, TableCell } from "@mui/material";
import { Adjust } from "components/AppComponents/AppBox/AppBox";
import {
  ButtonPrimary,
  ClosePositionButton,
} from "components/AppComponents/AppButton/AppButton";
import { AppTableRow } from "components/AppComponents/AppTable/AppTable";
import React, { Dispatch, FC, SetStateAction, useCallback } from "react";
import IOpenPosition from "stores/interfaces/IOpenPosition";
import BigNumber from "bignumber.js";
import { Constants } from "helpers/Constants";
import PoolStore from "stores/pool.store";

type PositionListItemProps = {
  position: IOpenPosition;
  setSelectedPosition: Dispatch<SetStateAction<IOpenPosition | undefined>>;
  poolStore: PoolStore;
  approve: () => void;
  approvalPending: boolean;
  approveBtn: boolean;
};

const PositionListItem: FC<PositionListItemProps> = observer(
  ({
    position,
    setSelectedPosition,
    poolStore,
    approvalPending,
    approveBtn,
    approve,
  }) => {
    const getFormattedSafetyBuffer = useCallback((safetyBuffer: BigNumber) => {
      return safetyBuffer.div(Constants.WeiPerWad).decimalPlaces(2).toString();
    }, []);

    return (
      <AppTableRow
        key={position.id}
        sx={{
          "&:last-child td, &:last-child th": { border: 0 },
          td: { paddingLeft: "10px", textAlign: "left" },
        }}
      >
        <TableCell component="td" scope="row">
          {position.id}
        </TableCell>
        <TableCell>{poolStore.getPool(position.pool)?.name}</TableCell>
        <TableCell>
          {getFormattedSafetyBuffer(position.debtShare)} FXD
        </TableCell>
        <TableCell>
          {getFormattedSafetyBuffer(position?.lockedCollateral)}{" "}
          {poolStore.getPool(position.pool)?.name}
        </TableCell>
        <TableCell>
          $ {getFormattedSafetyBuffer(position.lockedValue)}
        </TableCell>
        <TableCell>{position.ltv.toNumber() / 10}%</TableCell>
        <TableCell align="right">
          <Grid container justifyContent="center">
            <Grid xs={2} item>
              <Adjust>Adjust</Adjust>
            </Grid>
            {(approvalPending || approveBtn) && (
              <Grid xs={4} item>
                {approveBtn ? (
                  <ButtonPrimary onClick={approve} sx={{ height: "32px" }}>
                    {approvalPending ? (
                      <CircularProgress size={20} sx={{ color: "#0D1526" }} />
                    ) : (
                      "Approve FXD"
                    )}
                  </ButtonPrimary>
                ) : null}
              </Grid>
            )}
            <Grid xs={3} item>
              <ClosePositionButton
                onClick={() => setSelectedPosition(position)}
              >
                Close position
              </ClosePositionButton>
            </Grid>
          </Grid>
        </TableCell>
      </AppTableRow>
    );
  }
);

export default PositionListItem;
