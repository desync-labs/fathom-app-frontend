import { valueToBigNumber } from "@into-the-fathom/lending-math-utils";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Box, Checkbox, SvgIcon, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { PriceImpactTooltip } from "apps/lending/components/infoTooltips/PriceImpactTooltip";
import { Warning } from "apps/lending/components/primitives/Warning";
import {
  ComputedUserReserveData,
  useAppDataContext,
} from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { useCollateralSwap } from "apps/lending/hooks/paraswap/useCollateralSwap";
import { useModalContext } from "apps/lending/hooks/useModal";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { useWeb3Context } from "apps/lending/libs/hooks/useWeb3Context";
import { ListSlippageButton } from "apps/lending/modules/dashboard/lists/SlippageList";
import { useRootStore } from "apps/lending/store/root";
import { calculateHFAfterWithdraw } from "apps/lending/utils/hfUtils";
import { GENERAL } from "apps/lending/utils/mixPanelEvents";

import {
  Asset,
  AssetInput,
} from "apps/lending/components/transactions/AssetInput";
import { GasEstimationError } from "apps/lending/components/transactions/FlowCommons/GasEstimationError";
import { ModalWrapperProps } from "apps/lending/components/transactions/FlowCommons/ModalWrapper";
import {
  DetailsHFLine,
  DetailsNumberLine,
  TxModalDetails,
} from "apps/lending/components/transactions/FlowCommons/TxModalDetails";
import { zeroLTVBlockingWithdraw } from "apps/lending/components/transactions/utils";
import { calculateMaxWithdrawAmount } from "apps/lending/components/transactions/Withdraw/utils";
import { WithdrawAndSwitchActions } from "apps/lending/components/transactions/Withdraw/WithdrawAndSwitchActions";
import { WithdrawAndSwitchTxSuccessView } from "apps/lending/components/transactions/Withdraw/WithdrawAndSwitchSuccess";
import { useWithdrawError } from "apps/lending/components/transactions/Withdraw/WithdrawError";

export enum ErrorType {
  CAN_NOT_WITHDRAW_THIS_AMOUNT,
  POOL_DOES_NOT_HAVE_ENOUGH_LIQUIDITY,
  ZERO_LTV_WITHDRAW_BLOCKED,
}

export const WithdrawAndSwitchModalContent = ({
  poolReserve,
  userReserve,
  symbol,
  isWrongNetwork,
}: ModalWrapperProps) => {
  const { gasLimit, mainTxState: withdrawTxState, txError } = useModalContext();
  const { currentAccount } = useWeb3Context();
  const { user, reserves } = useAppDataContext();
  const { currentNetworkConfig, currentChainId } = useProtocolDataContext();

  const [_amount, setAmount] = useState("");
  const [riskCheckboxAccepted, setRiskCheckboxAccepted] = useState(false);
  const amountRef = useRef<string>("");
  const trackEvent = useRootStore((store) => store.trackEvent);
  const [maxSlippage, setMaxSlippage] = useState("0.1");

  let swapTargets = reserves
    .filter((r) => r.underlyingAsset !== poolReserve.underlyingAsset)
    .map((reserve) => ({
      address: reserve.underlyingAsset,
      symbol: reserve.symbol,
      iconSymbol: reserve.iconSymbol,
    }));

  swapTargets = [
    ...swapTargets.filter((r) => r.symbol === "GHO"),
    ...swapTargets.filter((r) => r.symbol !== "GHO"),
  ];

  const [targetReserve, setTargetReserve] = useState<Asset>(swapTargets[0]);

  const isMaxSelected = _amount === "-1";

  const swapTarget = user.userReservesData.find(
    (r) => r.underlyingAsset === targetReserve.address
  ) as ComputedUserReserveData;

  const maxAmountToWithdraw = calculateMaxWithdrawAmount(
    user,
    userReserve,
    poolReserve
  );
  const underlyingBalance = valueToBigNumber(
    userReserve?.underlyingBalance || "0"
  );

  const {
    inputAmountUSD,
    inputAmount,
    outputAmount,
    outputAmountUSD,
    error,
    loading: routeLoading,
    buildTxFn,
  } = useCollateralSwap({
    chainId: currentNetworkConfig.underlyingChainId || currentChainId,
    userAddress: currentAccount,
    swapIn: { ...poolReserve, amount: amountRef.current },
    swapOut: { ...swapTarget.reserve, amount: "0" },
    max: isMaxSelected && maxAmountToWithdraw.eq(underlyingBalance),
    skip: withdrawTxState.loading || false,
    maxSlippage: Number(maxSlippage),
  });

  const loadingSkeleton = routeLoading && outputAmountUSD === "0";
  const unborrowedLiquidity = valueToBigNumber(poolReserve.unborrowedLiquidity);

  const assetsBlockingWithdraw: string[] = zeroLTVBlockingWithdraw(user);

  const withdrawAmount = isMaxSelected
    ? maxAmountToWithdraw.toString(10)
    : _amount;

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

  const handleChange = (value: string) => {
    const maxSelected = value === "-1";
    amountRef.current = maxSelected ? maxAmountToWithdraw.toString(10) : value;
    setAmount(value);
    if (maxSelected && maxAmountToWithdraw.eq(underlyingBalance)) {
      trackEvent(GENERAL.MAX_INPUT_SELECTION, { type: "withdraw" });
    }
  };

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
      <WithdrawAndSwitchTxSuccessView
        txHash={withdrawTxState.txHash}
        amount={inputAmount}
        symbol={
          poolReserve.isWrappedBaseAsset
            ? currentNetworkConfig.baseAssetSymbol
            : poolReserve.symbol
        }
        outSymbol={targetReserve.symbol}
        outAmount={outputAmount}
      />
    );

  return (
    <>
      <AssetInput
        inputTitle={<>Withdraw</>}
        value={withdrawAmount}
        onChange={handleChange}
        symbol={symbol}
        assets={[
          {
            balance: maxAmountToWithdraw.toString(10),
            symbol: symbol,
            iconSymbol: poolReserve.isWrappedBaseAsset
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

      <Box
        sx={{
          padding: "18px",
          pt: "14px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <SvgIcon sx={{ fontSize: "18px !important" }}>
          <ArrowDownwardIcon />
        </SvgIcon>

        <PriceImpactTooltip
          loading={loadingSkeleton}
          outputAmountUSD={outputAmountUSD}
          inputAmountUSD={inputAmountUSD}
        />
      </Box>

      <AssetInput
        value={outputAmount}
        onSelect={setTargetReserve}
        usdValue={outputAmountUSD}
        symbol={targetReserve.symbol}
        assets={swapTargets}
        inputTitle={<>Receive (est.)</>}
        balanceText={<>Supply balance</>}
        disableInput
        loading={loadingSkeleton}
      />

      {error && !loadingSkeleton && (
        <Typography variant="helperText" color="error.main">
          {error}
        </Typography>
      )}

      {blockingError !== undefined && (
        <Typography variant="helperText" color="error.main">
          {errorComponent}
        </Typography>
      )}

      <TxModalDetails
        gasLimit={gasLimit}
        slippageSelector={
          <ListSlippageButton
            selectedSlippage={maxSlippage}
            setSlippage={setMaxSlippage}
          />
        }
      >
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

      <WithdrawAndSwitchActions
        poolReserve={poolReserve}
        targetReserve={swapTarget.reserve}
        amountToSwap={inputAmount}
        amountToReceive={outputAmount}
        isMaxSelected={
          isMaxSelected && maxAmountToWithdraw.eq(underlyingBalance)
        }
        isWrongNetwork={isWrongNetwork}
        blocked={
          blockingError !== undefined ||
          (displayRiskCheckbox && !riskCheckboxAccepted)
        }
        buildTxFn={buildTxFn}
        sx={displayRiskCheckbox ? { mt: 0 } : {}}
      />
    </>
  );
};
