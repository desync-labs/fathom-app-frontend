import { FC, memo } from "react";
import BigNumber from "bignumber.js";
import { Box, styled } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import {
  IFxdTransaction,
  PositionActivityState,
} from "hooks/Pools/usePositionsTransactionList";
import { getTokenLogoURL } from "utils/tokenLogo";
import { formatNumber } from "utils/format";

const ArrowIcon = styled(ArrowForwardRoundedIcon)`
  color: #6d86b2;
  width: 20px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 18px;
    height: 18px;
  }
`;

const BirnIcon = styled("span")`
  font-size: 20px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 18px;
  }
`;

const PositionActivityListItemAmountsWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: 7px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    gap: 2px;
  }
`;

const TokenAmount = styled(Box)`
  word-break: break-word;
  width: 100%;
`;

const PositionActivityListItemAmountsItemWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: 5px;
  & img {
    border-radius: 50%;
  }
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: auto;

    & img {
      width: 18px;
      height: 18px;
    }
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

        <ArrowIcon />

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

        <ArrowIcon />

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
  } else if (
    [PositionActivityState.LIQUIDATION].includes(transaction.activityState)
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
            -{formatNumber(Number(transaction.collateralAmount))}{" "}
            {transaction.position?.collateralPoolName?.toUpperCase()}
          </TokenAmount>
        </PositionActivityListItemAmountsItemWrapper>

        <ArrowIcon />

        <PositionActivityListItemAmountsItemWrapper>
          <BirnIcon>🔥</BirnIcon>
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

      <ArrowIcon />

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
