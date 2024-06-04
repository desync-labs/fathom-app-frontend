import {
  API_ETH_MOCK_ADDRESS,
  InterestRate,
} from "@into-the-fathom/lending-contract-helpers";
import {
  BigNumberValue,
  USD_DECIMALS,
  valueToBigNumber,
} from "@into-the-fathom/lending-math-utils";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { FC, memo, ReactNode, useState } from "react";
import { WalletIcon } from "apps/lending/components/icons/WalletIcon";
import { getMarketInfoById } from "apps/lending/components/MarketSwitcher";
import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";
import { Warning } from "apps/lending/components/primitives/Warning";
import { StyledTxModalToggleButton } from "apps/lending/components/StyledToggleButton";
import { StyledTxModalToggleGroup } from "apps/lending/components/StyledToggleButtonGroup";
import { ConnectWalletButton } from "apps/lending/components/WalletConnection/ConnectWalletButton";
import {
  ComputedReserveData,
  useAppDataContext,
} from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { useWalletBalances } from "apps/lending/hooks/app-data-provider/useWalletBalances";
import { useModalContext } from "apps/lending/hooks/useModal";
import { usePermissions } from "apps/lending/hooks/usePermissions";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { useWeb3Context } from "apps/lending/libs/hooks/useWeb3Context";
import { useRootStore } from "apps/lending/store/root";
import { getMaxAmountAvailableToBorrow } from "apps/lending/utils/getMaxAmountAvailableToBorrow";
import { getMaxAmountAvailableToSupply } from "apps/lending/utils/getMaxAmountAvailableToSupply";
import { GENERAL } from "apps/lending/utils/mixPanelEvents";
import { amountToUsd } from "apps/lending/utils/utils";

import { CapType } from "apps/lending/components/caps/helper";
import { AvailableTooltip } from "apps/lending/components/infoTooltips/AvailableTooltip";
import { Link, ROUTES } from "apps/lending/components/primitives/Link";
import { useReserveActionState } from "apps/lending/hooks/useReserveActionState";

const amountToUSD = (
  amount: BigNumberValue,
  formattedPriceInMarketReferenceCurrency: string,
  marketReferencePriceInUsd: string
) => {
  return valueToBigNumber(amount)
    .multipliedBy(formattedPriceInMarketReferenceCurrency)
    .multipliedBy(marketReferencePriceInUsd)
    .shiftedBy(-USD_DECIMALS)
    .toString();
};

interface ReserveActionsProps {
  reserve: ComputedReserveData;
}

export const ReserveActions: FC<ReserveActionsProps> = memo(({ reserve }) => {
  const [selectedAsset, setSelectedAsset] = useState<string>(reserve.symbol);

  const { currentAccount, loading: loadingWeb3Context } = useWeb3Context();
  const { isPermissionsLoading } = usePermissions();
  const { openBorrow, openSupply } = useModalContext();
  const { currentMarket, currentNetworkConfig } = useProtocolDataContext();
  const {
    user,
    loading: loadingReserves,
    marketReferencePriceInUsd,
  } = useAppDataContext();
  const { walletBalances, loading: loadingWalletBalance } = useWalletBalances();

  const [minRemainingBaseTokenBalance] = useRootStore((store) => [
    store.poolComputed.minRemainingBaseTokenBalance,
  ]);
  const { baseAssetSymbol } = currentNetworkConfig;
  let balance = walletBalances[reserve.underlyingAsset];
  if (reserve.isWrappedBaseAsset && selectedAsset === baseAssetSymbol) {
    balance = walletBalances[API_ETH_MOCK_ADDRESS.toLowerCase()];
  }

  let maxAmountToBorrow = "0";
  let maxAmountToSupply = "0";

  maxAmountToBorrow = getMaxAmountAvailableToBorrow(
    reserve,
    user,
    InterestRate.Variable
  ).toString();

  maxAmountToSupply = getMaxAmountAvailableToSupply(
    balance?.amount || "0",
    reserve,
    reserve.underlyingAsset,
    minRemainingBaseTokenBalance
  ).toString();

  const maxAmountToBorrowUsd = amountToUsd(
    maxAmountToBorrow,
    reserve.formattedPriceInMarketReferenceCurrency,
    marketReferencePriceInUsd
  ).toString();

  const maxAmountToSupplyUsd = amountToUSD(
    maxAmountToSupply,
    reserve.formattedPriceInMarketReferenceCurrency,
    marketReferencePriceInUsd
  ).toString();

  const { disableSupplyButton, disableBorrowButton, alerts } =
    useReserveActionState({
      balance: balance?.amount || "0",
      maxAmountToSupply: maxAmountToSupply.toString(),
      maxAmountToBorrow: maxAmountToBorrow.toString(),
      reserve,
    });

  if (!currentAccount && !isPermissionsLoading) {
    return <ConnectWallet loading={loadingWeb3Context} />;
  }

  if (loadingReserves || loadingWalletBalance) {
    return <ActionsSkeleton />;
  }

  const onSupplyClicked = () => {
    if (reserve.isWrappedBaseAsset && selectedAsset === baseAssetSymbol) {
      openSupply(
        API_ETH_MOCK_ADDRESS.toLowerCase(),
        currentMarket,
        reserve.name,
        "reserve",
        true
      );
    } else {
      openSupply(
        reserve.underlyingAsset,
        currentMarket,
        reserve.name,
        "reserve",
        true
      );
    }
  };

  const { market } = getMarketInfoById(currentMarket);

  return (
    <PaperWrapper>
      {reserve.isWrappedBaseAsset && (
        <Box>
          <WrappedBaseAssetSelector
            assetSymbol={reserve.symbol}
            baseAssetSymbol={baseAssetSymbol}
            selectedAsset={selectedAsset}
            setSelectedAsset={setSelectedAsset}
          />
        </Box>
      )}
      <WalletBalance
        balance={balance.amount}
        symbol={selectedAsset}
        marketTitle={market.marketTitle}
      />
      {reserve.isFrozen || reserve.isPaused ? (
        <Box sx={{ mt: 1.5 }}>
          {reserve.isPaused ? <PauseWarning /> : <FrozenWarning />}
        </Box>
      ) : (
        <>
          <Divider sx={{ my: 3 }} />
          <Stack gap={1.5}>
            <SupplyAction
              reserve={reserve}
              value={maxAmountToSupply.toString()}
              usdValue={maxAmountToSupplyUsd}
              symbol={selectedAsset}
              disable={disableSupplyButton}
              onActionClicked={onSupplyClicked}
            />
            {reserve.borrowingEnabled && (
              <BorrowAction
                reserve={reserve}
                value={maxAmountToBorrow.toString()}
                usdValue={maxAmountToBorrowUsd}
                symbol={selectedAsset}
                disable={disableBorrowButton}
                onActionClicked={() => {
                  openBorrow(
                    reserve.underlyingAsset,
                    currentMarket,
                    reserve.name,
                    "reserve",
                    true
                  );
                }}
              />
            )}
            {alerts}
          </Stack>
        </>
      )}
    </PaperWrapper>
  );
});

const PauseWarning = () => {
  return (
    <Warning sx={{ mb: 0 }} severity="error" icon={true}>
      Because this asset is paused, no actions can be taken until further notice
    </Warning>
  );
};

const FrozenWarning = () => {
  return (
    <Warning sx={{ mb: 0 }} severity="error" icon={true}>
      Since this asset is frozen, the only available actions are withdraw and
      repay which can be accessed from the{" "}
      <Link href={ROUTES.dashboard}>Dashboard</Link>
    </Warning>
  );
};

const ActionsSkeleton = () => {
  const RowSkeleton = (
    <Stack>
      <Skeleton width={150} height={14} />
      <Stack
        sx={{ height: "44px" }}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Skeleton width={100} height={14} sx={{ mt: 0.5, mb: 1 }} />
          <Skeleton width={75} height={12} />
        </Box>
        <Skeleton height={36} width={96} />
      </Stack>
    </Stack>
  );

  return (
    <PaperWrapper>
      <Stack direction="row" gap={1.5}>
        <Skeleton width={42} height={42} sx={{ borderRadius: "12px" }} />
        <Box>
          <Skeleton width={100} height={12} sx={{ mt: 0.5, mb: 1 }} />
          <Skeleton width={100} height={14} />
        </Box>
      </Stack>
      <Divider sx={{ my: 3 }} />
      <Box>
        <Stack gap={1.5}>
          {RowSkeleton}
          {RowSkeleton}
        </Stack>
      </Box>
    </PaperWrapper>
  );
};

const PaperWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Paper
      variant="outlined"
      sx={{ pt: 2, pb: { xs: 2, xsm: 3 }, px: { xs: 2, xsm: 3 } }}
    >
      <Typography
        variant="h3"
        sx={{ mb: 3 }}
        color={(theme) => theme.palette.text.primary}
      >
        Your info
      </Typography>

      {children}
    </Paper>
  );
};

const ConnectWallet: FC<{ loading: boolean }> = ({ loading }) => {
  return (
    <Paper sx={{ pt: 2, pb: { xs: 2, xsm: 3 }, px: { xs: 2, xsm: 3 } }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Typography
            variant="h3"
            sx={{ mb: { xs: 3, xsm: 5 } }}
            color={(theme) => theme.palette.text.primary}
          >
            Your info
          </Typography>
          <Typography sx={{ mb: 3 }} color="text.secondary">
            Please connect a wallet to view your personal information here.
          </Typography>
          <ConnectWalletButton />
        </>
      )}
    </Paper>
  );
};

interface ActionProps {
  value: string;
  usdValue: string;
  symbol: string;
  disable: boolean;
  onActionClicked: () => void;
  reserve: ComputedReserveData;
}

const SupplyAction: FC<ActionProps> = memo(
  ({ reserve, value, usdValue, symbol, disable, onActionClicked }) => {
    return (
      <Stack>
        <AvailableTooltip
          variant="description"
          text={"Available to supply"}
          capType={CapType.supplyCap}
          event={{
            eventName: GENERAL.TOOL_TIP,
            eventParams: {
              tooltip: "Available to supply: your info",
              asset: reserve.underlyingAsset,
              assetName: reserve.name,
            },
          }}
          textColor="text.light"
        />
        <Stack
          sx={{ height: "44px" }}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <ValueWithSymbol value={value} symbol={symbol} />
            <FormattedNumber
              value={usdValue}
              variant="subheader2"
              color="text.muted"
              symbolsColor="text.muted"
              symbol="USD"
            />
          </Box>
          <Button
            sx={{ height: "36px", width: "96px" }}
            onClick={onActionClicked}
            disabled={disable}
            fullWidth={false}
            variant="gradient"
            data-cy="supplyButton"
          >
            Supply
          </Button>
        </Stack>
      </Stack>
    );
  }
);

const BorrowAction: FC<ActionProps> = memo(
  ({ reserve, value, usdValue, symbol, disable, onActionClicked }) => {
    return (
      <Stack>
        <AvailableTooltip
          variant="description"
          text={"Available to borrow"}
          capType={CapType.borrowCap}
          event={{
            eventName: GENERAL.TOOL_TIP,
            eventParams: {
              tooltip: "Available to borrow: your info",
              asset: reserve.underlyingAsset,
              assetName: reserve.name,
            },
          }}
          textColor="text.light"
        />
        <Stack
          sx={{ height: "44px" }}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <ValueWithSymbol value={value} symbol={symbol} />
            <FormattedNumber
              value={usdValue}
              variant="subheader2"
              color="text.muted"
              symbolsColor="text.muted"
              symbol="USD"
            />
          </Box>
          <Button
            sx={{ height: "36px", width: "96px" }}
            onClick={onActionClicked}
            disabled={disable}
            fullWidth={false}
            variant="gradient"
            data-cy="borrowButton"
          >
            Borrow
          </Button>
        </Stack>
      </Stack>
    );
  }
);

const WrappedBaseAssetSelector: FC<{
  assetSymbol: string;
  baseAssetSymbol: string;
  selectedAsset: string;
  setSelectedAsset: (value: string) => void;
}> = memo(
  ({ assetSymbol, baseAssetSymbol, selectedAsset, setSelectedAsset }) => {
    return (
      <StyledTxModalToggleGroup
        color="primary"
        value={selectedAsset}
        exclusive
        onChange={(_, value) => setSelectedAsset(value)}
        sx={{ mb: 4 }}
      >
        <StyledTxModalToggleButton value={assetSymbol}>
          <Typography variant="buttonM">{assetSymbol}</Typography>
        </StyledTxModalToggleButton>

        <StyledTxModalToggleButton value={baseAssetSymbol}>
          <Typography variant="buttonM">{baseAssetSymbol}</Typography>
        </StyledTxModalToggleButton>
      </StyledTxModalToggleGroup>
    );
  }
);

interface ValueWithSymbolProps {
  value: string;
  symbol: string;
  children?: ReactNode;
}

const ValueWithSymbol: FC<ValueWithSymbolProps> = memo(
  ({ value, symbol, children }) => {
    return (
      <Stack direction="row" alignItems="center" gap={0.5}>
        <FormattedNumber value={value} variant="h4" color="text.light" />
        <Typography variant="buttonL" color="text.secondary">
          {symbol}
        </Typography>
        {children}
      </Stack>
    );
  }
);

interface WalletBalanceProps {
  balance: string;
  symbol: string;
  marketTitle: string;
}
const WalletBalance: FC<WalletBalanceProps> = memo(({ balance, symbol }) => {
  const theme = useTheme();

  return (
    <Stack direction="row" gap={1.5}>
      <Box
        sx={(theme) => ({
          width: "42px",
          height: "42px",
          background: theme.palette.background.surface,
          border: `0.5px solid ${theme.palette.background.disabled}`,
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        })}
      >
        <WalletIcon sx={{ stroke: `${theme.palette.text.secondary}` }} />
      </Box>
      <Box>
        <Typography variant="description" color="text.secondary">
          Wallet balance
        </Typography>
        <ValueWithSymbol value={balance} symbol={symbol} />
      </Box>
    </Stack>
  );
});
