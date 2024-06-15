import { FC, memo } from "react";
import {
  IFxdTransaction,
  PositionActivityState,
} from "hooks/Pools/usePositionsTransactionList";
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
    justify-content: space-between;
    gap: 2px;
  }
`;

const TokenAmount = styled(Box)`
  word-break: break-word;
  width: 100%;
`;

const PositionActivityListItemAmountsItemWrapper = styled(Box)`
  display: flex;
  align-items: start;
  gap: 5px;
  padding-top: 2px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
  }
`;

const PositionActivityListItemAmounts: FC<{
  transaction: IFxdTransaction;
}> = ({ transaction }) => {
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
          <TokenAmount>
            {formatNumber(Number(transaction.debtAmount))} FXD
          </TokenAmount>
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
          <TokenAmount>
            +{formatNumber(Math.abs(Number(transaction.collateralAmount)))}{" "}
            {transaction.position?.collateralPoolName?.toUpperCase()}
          </TokenAmount>
        </PositionActivityListItemAmountsItemWrapper>
      </PositionActivityListItemAmountsWrapper>
    );
  } else if (
    [PositionActivityState.TOP_UP].includes(transaction.activityState)
  ) {
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
          <TokenAmount>
            {!BigNumber(transaction.collateralAmount).isEqualTo(0) ? "-" : ""}
            {formatNumber(Number(transaction.collateralAmount))}{" "}
            {transaction.position?.collateralPoolName?.toUpperCase()}
          </TokenAmount>
        </PositionActivityListItemAmountsItemWrapper>

        <KeyboardDoubleArrowRightRoundedIcon width={20} />

        <PositionActivityListItemAmountsItemWrapper>
          <img
            width={20}
            height={20}
            src={getTokenLogoURL("FXD")}
            alt={"logo"}
          />
          <TokenAmount>
            +{formatNumber(Number(transaction.debtAmount))} FXD
          </TokenAmount>
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
        <TokenAmount>
          -{formatNumber(Number(transaction.collateralAmount))}{" "}
          {transaction.position?.collateralPoolName?.toUpperCase()}
        </TokenAmount>
      </PositionActivityListItemAmountsItemWrapper>

      <KeyboardDoubleArrowRightRoundedIcon width={20} />

      <PositionActivityListItemAmountsItemWrapper>
        <img width={20} height={20} src={getTokenLogoURL("FXD")} alt={"logo"} />
        <TokenAmount>
          +{formatNumber(Number(transaction.debtAmount))} FXD
        </TokenAmount>
      </PositionActivityListItemAmountsItemWrapper>
    </PositionActivityListItemAmountsWrapper>
  );
};

export default memo(PositionActivityListItemAmounts);
