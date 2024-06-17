import {
  API_ETH_MOCK_ADDRESS,
  InterestRate,
} from "@into-the-fathom/lending-contract-helpers";
import {
  calculateHealthFactorFromBalancesBigUnits,
  USD_DECIMALS,
  valueToBigNumber,
} from "@into-the-fathom/lending-math-utils";
import { Typography } from "@mui/material";
import { FC, memo, useState } from "react";
import { APYTypeTooltip } from "apps/lending/components/infoTooltips/APYTypeTooltip";
import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";
import { Row } from "apps/lending/components/primitives/Row";
import { StyledTxModalToggleButton } from "apps/lending/components/StyledToggleButton";
import { StyledTxModalToggleGroup } from "apps/lending/components/StyledToggleButtonGroup";
import { useAppDataContext } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { useAssetCaps } from "apps/lending/hooks/useAssetCaps";
import { useModalContext } from "apps/lending/hooks/useModal";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { ERC20TokenType } from "apps/lending/libs/web3-data-provider/Web3Provider";
import { getMaxAmountAvailableToBorrow } from "apps/lending/utils/getMaxAmountAvailableToBorrow";
import { GENERAL } from "apps/lending/utils/mixPanelEvents";
import { roundToTokenDecimals } from "apps/lending/utils/utils";

import { CapType } from "apps/lending/components/caps/helper";
import { AssetInput } from "apps/lending/components/transactions/AssetInput";
import { GasEstimationError } from "apps/lending/components/transactions/FlowCommons/GasEstimationError";
import { ModalWrapperProps } from "apps/lending/components/transactions/FlowCommons/ModalWrapper";
import { TxSuccessView } from "apps/lending/components/transactions/FlowCommons/Success";
import {
  DetailsHFLine,
  DetailsIncentivesLine,
  DetailsUnwrapSwitch,
  TxModalDetails,
} from "apps/lending/components/transactions/FlowCommons/TxModalDetails";
import { BorrowActions } from "apps/lending/components/transactions/Borrow/BorrowActions";
import { BorrowAmountWarning } from "apps/lending/components/transactions/Borrow/BorrowAmountWarning";
import { ParameterChangeWarning } from "apps/lending/components/transactions/Borrow/ParameterChangeWarning";

export enum ErrorType {
  STABLE_RATE_NOT_ENABLED,
  NOT_ENOUGH_LIQUIDITY,
  BORROWING_NOT_AVAILABLE,
  NOT_ENOUGH_BORROWED,
}

interface BorrowModeSwitchProps {
  interestRateMode: InterestRate;
  setInterestRateMode: (value: InterestRate) => void;
  variableRate: string;
  stableRate: string;
}

const BorrowModeSwitch: FC<BorrowModeSwitchProps> = ({
  setInterestRateMode,
  interestRateMode,
  variableRate,
  stableRate,
}) => {
  return (
    <Row
      caption={
        <APYTypeTooltip
          text={"Borrow APY rate"}
          key="APY type_modal"
          variant="description"
        />
      }
      captionVariant="description"
      mb={5}
      flexDirection="column"
      align="flex-start"
      captionColor="text.secondary"
    >
      <StyledTxModalToggleGroup
        color="primary"
        value={interestRateMode}
        exclusive
        onChange={(_, value) => setInterestRateMode(value)}
        sx={{ mt: 0.5 }}
      >
        <StyledTxModalToggleButton
          value={InterestRate.Variable}
          disabled={interestRateMode === InterestRate.Variable}
        >
          <Typography variant="buttonM" sx={{ mr: 1 }}>
            Variable
          </Typography>
          <FormattedNumber value={variableRate} percent variant="secondary14" />
        </StyledTxModalToggleButton>
        <StyledTxModalToggleButton
          value={InterestRate.Stable}
          disabled={interestRateMode === InterestRate.Stable}
        >
          <Typography variant="buttonM" sx={{ mr: 1 }}>
            Stable
          </Typography>
          <FormattedNumber value={stableRate} percent variant="secondary14" />
        </StyledTxModalToggleButton>
      </StyledTxModalToggleGroup>
    </Row>
  );
};

export const BorrowModalContent: FC<
  ModalWrapperProps & {
    unwrap: boolean;
    setUnwrap: (unwrap: boolean) => void;
  }
> = memo(
  ({
    underlyingAsset,
    isWrongNetwork,
    poolReserve,
    userReserve,
    unwrap: borrowUnWrapped,
    setUnwrap: setBorrowUnWrapped,
    symbol,
  }) => {
    const { mainTxState: borrowTxState, gasLimit, txError } = useModalContext();
    const { user, marketReferencePriceInUsd } = useAppDataContext();
    const { currentNetworkConfig } = useProtocolDataContext();
    const { borrowCap } = useAssetCaps();

    const [interestRateMode, setInterestRateMode] = useState<InterestRate>(
      InterestRate.Variable
    );
    const [amount, setAmount] = useState("");
    const [riskCheckboxAccepted, setRiskCheckboxAccepted] = useState(false);

    // amount calculations
    const maxAmountToBorrow = getMaxAmountAvailableToBorrow(
      poolReserve,
      user,
      interestRateMode
    );

    // We set this in a useEffect, so it doesn't constantly change when
    // max amount selected
    const handleChange = (_value: string) => {
      if (_value === "-1") {
        setAmount(maxAmountToBorrow);
      } else {
        const decimalTruncatedValue = roundToTokenDecimals(
          _value,
          poolReserve.decimals
        );
        setAmount(decimalTruncatedValue);
      }
    };

    const isMaxSelected = amount === maxAmountToBorrow;

    // health factor calculations
    const amountToBorrowInUsd = valueToBigNumber(amount)
      .multipliedBy(poolReserve.formattedPriceInMarketReferenceCurrency)
      .multipliedBy(marketReferencePriceInUsd)
      .shiftedBy(-USD_DECIMALS);

    const newHealthFactor = calculateHealthFactorFromBalancesBigUnits({
      collateralBalanceMarketReferenceCurrency: user.totalCollateralUSD,
      borrowBalanceMarketReferenceCurrency: valueToBigNumber(
        user.totalBorrowsUSD
      ).plus(amountToBorrowInUsd),
      currentLiquidationThreshold: user.currentLiquidationThreshold,
    });
    const displayRiskCheckbox =
      newHealthFactor.toNumber() < 1.5 && newHealthFactor.toString() !== "-1";

    // calculating input usd value
    const usdValue = valueToBigNumber(amount).multipliedBy(
      poolReserve.priceInUSD
    );

    // error types handling
    let blockingError: ErrorType | undefined = undefined;
    if (
      interestRateMode === InterestRate.Stable &&
      !poolReserve.stableBorrowRateEnabled
    ) {
      blockingError = ErrorType.STABLE_RATE_NOT_ENABLED;
    } else if (
      interestRateMode === InterestRate.Stable &&
      userReserve?.usageAsCollateralEnabledOnUser &&
      valueToBigNumber(amount).lt(userReserve?.underlyingBalance || 0)
    ) {
      blockingError = ErrorType.NOT_ENOUGH_BORROWED;
    } else if (
      valueToBigNumber(amount).gt(poolReserve.formattedAvailableLiquidity)
    ) {
      blockingError = ErrorType.NOT_ENOUGH_LIQUIDITY;
    } else if (!poolReserve.borrowingEnabled) {
      blockingError = ErrorType.BORROWING_NOT_AVAILABLE;
    }

    // error render handling
    const handleBlocked = () => {
      switch (blockingError) {
        case ErrorType.BORROWING_NOT_AVAILABLE:
          return (
            <>Borrowing is currently unavailable for {poolReserve.symbol}.</>
          );
        case ErrorType.NOT_ENOUGH_BORROWED:
          return (
            <>
              You can borrow this asset with a stable rate only if you borrow
              more than the amount you are supplying as collateral.
            </>
          );
        case ErrorType.NOT_ENOUGH_LIQUIDITY:
          return (
            <>
              There are not enough funds in the
              {poolReserve.symbol}
              reserve to borrow
            </>
          );
        case ErrorType.STABLE_RATE_NOT_ENABLED:
          return <>The Stable Rate is not enabled for this currency</>;
        default:
          return null;
      }
    };

    // token info to add to wallet
    const addToken: ERC20TokenType = {
      address: underlyingAsset,
      symbol: poolReserve.iconSymbol,
      decimals: poolReserve.decimals,
    };

    const iconSymbol =
      borrowUnWrapped && poolReserve.isWrappedBaseAsset
        ? currentNetworkConfig.baseAssetSymbol
        : poolReserve.iconSymbol;

    if (borrowTxState.success)
      return (
        <TxSuccessView
          action={"Borrowed"}
          amount={amount}
          symbol={iconSymbol}
          addToken={
            borrowUnWrapped && poolReserve.isWrappedBaseAsset
              ? undefined
              : addToken
          }
        />
      );

    const incentive =
      interestRateMode === InterestRate.Stable
        ? poolReserve.sIncentivesData
        : poolReserve.vIncentivesData;
    return (
      <>
        {borrowCap.determineWarningDisplay({ borrowCap })}

        {poolReserve.stableBorrowRateEnabled && (
          <BorrowModeSwitch
            interestRateMode={interestRateMode}
            setInterestRateMode={setInterestRateMode}
            variableRate={poolReserve.variableBorrowAPY}
            stableRate={poolReserve.stableBorrowAPY}
          />
        )}

        <AssetInput
          value={amount}
          onChange={handleChange}
          usdValue={usdValue.toString(10)}
          assets={[
            {
              balance: maxAmountToBorrow,
              symbol,
              iconSymbol,
            },
          ]}
          symbol={symbol}
          capType={CapType.borrowCap}
          isMaxSelected={isMaxSelected}
          maxValue={maxAmountToBorrow}
          balanceText={"Available"}
          event={{
            eventName: GENERAL.MAX_INPUT_SELECTION,
            eventParams: {
              asset: poolReserve.underlyingAsset,
              assetName: poolReserve.name,
            },
          }}
        />

        {blockingError !== undefined && (
          <Typography variant="helperText" color="error.main">
            {handleBlocked()}
          </Typography>
        )}

        {poolReserve.isWrappedBaseAsset && (
          <DetailsUnwrapSwitch
            unwrapped={borrowUnWrapped}
            setUnWrapped={setBorrowUnWrapped}
            label={
              <Typography>{`Unwrap ${poolReserve.symbol} (to borrow ${currentNetworkConfig.baseAssetSymbol})`}</Typography>
            }
          />
        )}

        <TxModalDetails gasLimit={gasLimit}>
          <DetailsIncentivesLine
            incentives={incentive}
            symbol={poolReserve.symbol}
          />
          <DetailsHFLine
            visibleHfChange={!!amount}
            healthFactor={user.healthFactor}
            futureHealthFactor={newHealthFactor.toString(10)}
          />
        </TxModalDetails>

        {txError && <GasEstimationError txError={txError} />}

        {displayRiskCheckbox && (
          <BorrowAmountWarning
            riskCheckboxAccepted={riskCheckboxAccepted}
            onRiskCheckboxChange={() => {
              setRiskCheckboxAccepted(!riskCheckboxAccepted);
            }}
          />
        )}

        <ParameterChangeWarning underlyingAsset={underlyingAsset} />

        <BorrowActions
          poolReserve={poolReserve}
          amountToBorrow={amount}
          poolAddress={
            borrowUnWrapped && poolReserve.isWrappedBaseAsset
              ? API_ETH_MOCK_ADDRESS
              : poolReserve.underlyingAsset
          }
          interestRateMode={interestRateMode}
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
  }
);
