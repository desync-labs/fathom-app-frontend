import { FC, memo } from "react";
import {
  IFxdTransaction,
  PositionActivityState,
} from "hooks/usePositionsTransactionList";
import { Box, styled } from "@mui/material";
import { getTokenLogoURL } from "utils/tokenLogo";
import { formatNumber } from "utils/format";
import KeyboardDoubleArrowRightRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowRightRounded";
import BigNumber from "bignumber.js";

const PositionActivityListItemAmountsWrapper = styled(Box)`
  display: flex;
  align-items: start;
  gap: 7px;
`;

const PositionActivityListItemAmounts: FC<{
  transaction: IFxdTransaction;
}> = ({ transaction }) => {
  if (transaction.activityState === PositionActivityState.CLOSED) {
    console.log(transaction);
  }

  if (
    [PositionActivityState.REPAY, PositionActivityState.CLOSED].includes(
      transaction.activityState
    )
  ) {
    return (
      <PositionActivityListItemAmountsWrapper>
        <img width={20} height={20} src={getTokenLogoURL("FXD")} alt={"logo"} />
        <Box>{formatNumber(Number(transaction.debtAmount))} FXD</Box>
        <KeyboardDoubleArrowRightRoundedIcon width={20} />
        <img
          width={20}
          height={20}
          src={getTokenLogoURL(
            transaction.position?.collateralPoolName?.toUpperCase() === "XDC"
              ? "WXDC"
              : transaction.position?.collateralPoolName?.toUpperCase()
          )}
          alt={"logo"}
        />
        <Box>
          {formatNumber(Math.abs(Number(transaction.collateralAmount)))}{" "}
          {transaction.position?.collateralPoolName?.toUpperCase()}
        </Box>
      </PositionActivityListItemAmountsWrapper>
    );
  } else if (
    [PositionActivityState.TOP_UP].includes(transaction.activityState)
  ) {
    return (
      <PositionActivityListItemAmountsWrapper>
        <img
          width={20}
          height={20}
          src={getTokenLogoURL(
            transaction.position?.collateralPoolName?.toUpperCase() === "XDC"
              ? "WXDC"
              : transaction.position?.collateralPoolName?.toUpperCase()
          )}
          alt={"logo"}
        />
        <Box>
          {!BigNumber(transaction.collateralAmount).isEqualTo(0) ? "-" : ""}
          {formatNumber(Number(transaction.collateralAmount))}{" "}
          {transaction.position?.collateralPoolName?.toUpperCase()}
        </Box>
        <KeyboardDoubleArrowRightRoundedIcon width={20} />
        <img width={20} height={20} src={getTokenLogoURL("FXD")} alt={"logo"} />
        <Box>{formatNumber(Number(transaction.debtAmount))} FXD</Box>
      </PositionActivityListItemAmountsWrapper>
    );
  }
  return (
    <PositionActivityListItemAmountsWrapper>
      <img
        width={20}
        height={20}
        src={getTokenLogoURL(
          transaction.position?.collateralPoolName?.toUpperCase() === "XDC"
            ? "WXDC"
            : transaction.position?.collateralPoolName?.toUpperCase()
        )}
        alt={"logo"}
      />
      <Box>
        {formatNumber(Number(transaction.collateralAmount))}{" "}
        {transaction.position?.collateralPoolName?.toUpperCase()}
      </Box>
      <KeyboardDoubleArrowRightRoundedIcon width={20} />
      <img width={20} height={20} src={getTokenLogoURL("FXD")} alt={"logo"} />
      <Box>{formatNumber(Number(transaction.debtAmount))} FXD</Box>
    </PositionActivityListItemAmountsWrapper>
  );
};

export default memo(PositionActivityListItemAmounts);
