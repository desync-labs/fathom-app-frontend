import { API_ETH_MOCK_ADDRESS } from "@into-the-fathom/lending-contract-helpers";
import { valueToBigNumber } from "@into-the-fathom/lending-math-utils";
import { Box, Checkbox, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { Warning } from "apps/lending/components/primitives/Warning";
import { useAppDataContext } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { useModalContext } from "apps/lending/hooks/useModal";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { useRootStore } from "apps/lending/store/root";
import { calculateHFAfterWithdraw } from "apps/lending/utils/hfUtils";
import { GENERAL } from "apps/lending/utils/mixPanelEvents";

import { AssetInput } from "apps/lending/components/transactions/AssetInput";
import { GasEstimationError } from "apps/lending/components/transactions/FlowCommons/GasEstimationError";
import { ModalWrapperProps } from "apps/lending/components/transactions/FlowCommons/ModalWrapper";
import { TxSuccessView } from "apps/lending/components/transactions/FlowCommons/Success";
import {
  DetailsHFLine,
  DetailsNumberLine,
  DetailsUnwrapSwitch,
  TxModalDetails,
} from "apps/lending/components/transactions/FlowCommons/TxModalDetails";
import { zeroLTVBlockingWithdraw } from "apps/lending/components/transactions/utils";
import { calculateMaxWithdrawAmount } from "apps/lending/components/transactions/Withdraw/utils";
import { WithdrawActions } from "apps/lending/components/transactions/Withdraw/WithdrawActions";
import { useWithdrawError } from "apps/lending/components/transactions/Withdraw/WithdrawError";

export enum ErrorType {
  CAN_NOT_WITHDRAW_THIS_AMOUNT,
  POOL_DOES_NOT_HAVE_ENOUGH_LIQUIDITY,
  ZERO_LTV_WITHDRAW_BLOCKED,
}

export const WithdrawModalContent = ({
  poolReserve,
  userReserve,
  unwrap: withdrawUnWrapped,
  setUnwrap: setWithdrawUnWrapped,
  symbol,
  isWrongNetwork,
}: ModalWrapperProps & {
  unwrap: boolean;
  setUnwrap: (unwrap: boolean) => void;
}) => {
  const { gasLimit, mainTxState: withdrawTxState, txError } = useModalContext();
  const { user } = useAppDataContext();
  const { currentNetworkConfig } = useProtocolDataContext();

  const [_amount, setAmount] = useState("");
  const [withdrawMax, setWithdrawMax] = useState("");
  const [riskCheckboxAccepted, setRiskCheckboxAccepted] = useState(false);
  const amountRef = useRef<string>("");
  const trackEvent = useRootStore((store) => store.trackEvent);

  const isMaxSelected = _amount === "-1";
  const maxAmountToWithdraw = calculateMaxWithdrawAmount(
    user,
    userReserve,
    poolReserve
  );
  const underlyingBalance = valueToBigNumber(
    userReserve?.underlyingBalance || "0"
  );
  const unborrowedLiquidity = valueToBigNumber(poolReserve.unborrowedLiquidity);
  const withdrawAmount = isMaxSelected
    ? maxAmountToWithdraw.toString(10)
    : _amount;

  const handleChange = (value: string) => {
    const maxSelected = value === "-1";
    amountRef.current = maxSelected ? maxAmountToWithdraw.toString(10) : value;
    setAmount(value);
    if (maxSelected && maxAmountToWithdraw.eq(underlyingBalance)) {
      trackEvent(GENERAL.MAX_INPUT_SELECTION, { type: "withdraw" });
      setWithdrawMax("-1");
    } else {
      setWithdrawMax(maxAmountToWithdraw.toString(10));
    }
  };

  const assetsBlockingWithdraw: string[] = zeroLTVBlockingWithdraw(user);

  const healthFactorAfterWithdraw = calculateHFAfterWithdraw({
    user,
    userReserve,
    poolReserve,
    withdrawAmount,
  });

  const { blockingError, errorComponent } = useWithdrawError({
    assetsBlockingWithdraw,
    poolReserve,
    healthFactorAfterWithdraw,
    withdrawAmount,
  });

  const displayRiskCheckbox =
    healthFactorAfterWithdraw.toNumber() >= 1 &&
    healthFactorAfterWithdraw.toNumber() < 1.5 &&
    userReserve.usageAsCollateralEnabledOnUser;

  // calculating input usd value
  const usdValue = valueToBigNumber(withdrawAmount).multipliedBy(
    userReserve?.reserve.priceInUSD || 0
  );

  if (withdrawTxState.success)
    return (
      <TxSuccessView
        action={<>withdrew</>}
        amount={amountRef.current}
        symbol={
          withdrawUnWrapped && poolReserve.isWrappedBaseAsset
            ? currentNetworkConfig.baseAssetSymbol
            : poolReserve.symbol
        }
      />
    );

  return (
    <>
      <AssetInput
        value={withdrawAmount}
        onChange={handleChange}
        symbol={symbol}
        assets={[
          {
            balance: maxAmountToWithdraw.toString(10),
            symbol: symbol,
            iconSymbol:
              withdrawUnWrapped && poolReserve.isWrappedBaseAsset
                ? currentNetworkConfig.baseAssetSymbol
                : poolReserve.iconSymbol,
          },
        ]}
        usdValue={usdValue.toString(10)}
        isMaxSelected={isMaxSelected}
        disabled={withdrawTxState.loading}
        maxValue={maxAmountToWithdraw.toString(10)}
        balanceText={
          unborrowedLiquidity.lt(underlyingBalance) ? (
            <>Available</>
          ) : (
            <>Supply balance</>
          )
        }
      />

      {blockingError !== undefined && (
        <Typography variant="helperText" color="error.main">
          {errorComponent}
        </Typography>
      )}

      {poolReserve.isWrappedBaseAsset && (
        <DetailsUnwrapSwitch
          unwrapped={withdrawUnWrapped}
          setUnWrapped={setWithdrawUnWrapped}
          label={
            <Typography>{`Unwrap ${poolReserve.symbol} (to withdraw ${currentNetworkConfig.baseAssetSymbol})`}</Typography>
          }
        />
      )}

      <TxModalDetails gasLimit={gasLimit}>
        <DetailsNumberLine
          description={<>Remaining supply</>}
          value={underlyingBalance.minus(withdrawAmount || "0").toString(10)}
          symbol={
            poolReserve.isWrappedBaseAsset
              ? currentNetworkConfig.baseAssetSymbol
              : poolReserve.symbol
          }
        />
        <DetailsHFLine
          visibleHfChange={!!_amount}
          healthFactor={user ? user.healthFactor : "-1"}
          futureHealthFactor={healthFactorAfterWithdraw.toString(10)}
        />
      </TxModalDetails>

      {txError && <GasEstimationError txError={txError} />}

      {displayRiskCheckbox && (
        <>
          <Warning severity="error" sx={{ my: 6 }}>
            <>
              Withdrawing this amount will reduce your health factor and
              increase risk of liquidation.
            </>
          </Warning>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              mx: "24px",
              mb: "12px",
            }}
          >
            <Checkbox
              checked={riskCheckboxAccepted}
              onChange={() => {
                setRiskCheckboxAccepted(!riskCheckboxAccepted),
                  trackEvent(GENERAL.ACCEPT_RISK, {
                    modal: "Withdraw",
                    riskCheckboxAccepted: riskCheckboxAccepted,
                  });
              }}
              size="small"
              data-cy={`risk-checkbox`}
            />
            <Typography variant="description">
              <>I acknowledge the risks involved.</>
            </Typography>
          </Box>
        </>
      )}

      <WithdrawActions
        poolReserve={poolReserve}
        amountToWithdraw={isMaxSelected ? withdrawMax : withdrawAmount}
        poolAddress={
          withdrawUnWrapped && poolReserve.isWrappedBaseAsset
            ? API_ETH_MOCK_ADDRESS
            : poolReserve.underlyingAsset
        }
        isWrongNetwork={isWrongNetwork}
        symbol={symbol}
        blocked={
          blockingError !== undefined ||
          (displayRiskCheckbox && !riskCheckboxAccepted)
        }
        sx={displayRiskCheckbox ? { mt: 0 } : {}}
      />
    </>
  );
};
