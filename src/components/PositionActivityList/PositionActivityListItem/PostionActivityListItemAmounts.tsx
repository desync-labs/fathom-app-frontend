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
  ${({ theme }) => theme.breakpoints.down("sm")} {
    flex-direction: column;
  }
`;

const PositionActivityListItemAmountsItemWrapper = styled(Box)`
  display: flex;
  align-items: start;
  gap: 5px;
`;

const PositionActivityListItemAmounts: FC<{
  transaction: IFxdTransaction;
}> = ({ transaction }) => {
  // console.log({
  //   transaction,
  // });

  if (
    [PositionActivityState.REPAY, PositionActivityState.CLOSED].includes(
      transaction.activityState
    )
  ) {
    return (
      <PositionActivityListItemAmountsWrapper>
        <PositionActivityListItemAmountsItemWrapper>
          <img
            width={20}
            height={20}
            src={getTokenLogoURL("FXD")}
            alt={"logo"}
          />
          <Box>{formatNumber(Number(transaction.debtAmount))} FXD</Box>
        </PositionActivityListItemAmountsItemWrapper>
        <KeyboardDoubleArrowRightRoundedIcon width={20} />
        <PositionActivityListItemAmountsItemWrapper>
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
        </PositionActivityListItemAmountsItemWrapper>
      </PositionActivityListItemAmountsWrapper>
    );
  } else if (
    [PositionActivityState.TOP_UP].includes(transaction.activityState)
  ) {
    return (
      <PositionActivityListItemAmountsWrapper>
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
        </PositionActivityListItemAmountsWrapper>
        <KeyboardDoubleArrowRightRoundedIcon width={20} />
        <PositionActivityListItemAmountsItemWrapper>
          <img
            width={20}
            height={20}
            src={getTokenLogoURL("FXD")}
            alt={"logo"}
          />
          <Box>{formatNumber(Number(transaction.debtAmount))} FXD</Box>
        </PositionActivityListItemAmountsItemWrapper>
      </PositionActivityListItemAmountsWrapper>
    );
  }
  return (
    <PositionActivityListItemAmountsWrapper>
      <PositionActivityListItemAmountsItemWrapper>
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
      </PositionActivityListItemAmountsItemWrapper>

      <KeyboardDoubleArrowRightRoundedIcon width={20} />
      <PositionActivityListItemAmountsItemWrapper>
        <img width={20} height={20} src={getTokenLogoURL("FXD")} alt={"logo"} />
        <Box>{formatNumber(Number(transaction.debtAmount))} FXD</Box>
      </PositionActivityListItemAmountsItemWrapper>
    </PositionActivityListItemAmountsWrapper>
  );
};

export default memo(PositionActivityListItemAmounts);
