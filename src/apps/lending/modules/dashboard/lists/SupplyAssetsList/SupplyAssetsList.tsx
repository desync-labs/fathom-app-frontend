import { API_ETH_MOCK_ADDRESS } from "@into-the-fathom/lending-contract-helpers";
import {
  USD_DECIMALS,
  valueToBigNumber,
} from "@into-the-fathom/lending-math-utils";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import BigNumber from "bignumber.js";
import { FC, Fragment, useCallback, useMemo, useState } from "react";
import { ListColumn } from "apps/lending/components/lists/ListColumn";
import { ListHeaderTitle } from "apps/lending/components/lists/ListHeaderTitle";
import { ListHeaderWrapper } from "apps/lending/components/lists/ListHeaderWrapper";
import { Warning } from "apps/lending/components/primitives/Warning";
import { AssetCapsProvider } from "apps/lending/hooks/useAssetCaps";
import { fetchIconSymbolAndName } from "apps/lending/ui-config/reservePatches";

import { ListWrapper } from "apps/lending/components/lists/ListWrapper";
import { Link, ROUTES } from "apps/lending/components/primitives/Link";
import {
  ComputedReserveData,
  useAppDataContext,
} from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { useWalletBalances } from "apps/lending/hooks/app-data-provider/useWalletBalances";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import {
  DASHBOARD_LIST_COLUMN_WIDTHS,
  DashboardReserve,
  handleSortDashboardReserves,
} from "apps/lending/utils/dashboardSortUtils";
import { DashboardListTopPanel } from "apps/lending/modules/dashboard/DashboardListTopPanel";
import { ListButtonsColumn } from "apps/lending/modules/dashboard/lists/ListButtonsColumn";
import { ListLoader } from "apps/lending/modules/dashboard/lists/ListLoader";
import { SupplyAssetsListItem } from "apps/lending/modules/dashboard/lists/SupplyAssetsList/SupplyAssetsListItem";
import { SupplyAssetsListMobileItem } from "apps/lending/modules/dashboard/lists/SupplyAssetsList/SupplyAssetsListMobileItem";
import { WalletEmptyInfo } from "apps/lending/modules/dashboard/lists/SupplyAssetsList/WalletEmptyInfo";

const head = [
  { title: "Assets", sortKey: "symbol" },
  {
    title: "Wallet balance",
    sortKey: "walletBalance",
  },
  { title: "APY", sortKey: "supplyAPY" },
  {
    title: "Can be collateral",
    sortKey: "usageAsCollateralEnabledOnUser",
  },
];

const LOCAL_STORAGE_NAME = "showSupplyZeroAssets";

export const SupplyAssetsList = () => {
  const { currentNetworkConfig, currentChainId } = useProtocolDataContext();
  const {
    user,
    reserves,
    marketReferencePriceInUsd,
    loading: loadingReserves,
  } = useAppDataContext();

  const { walletBalances, loading } = useWalletBalances();
  const theme = useTheme();
  const downToXSM = useMediaQuery(theme.breakpoints.down("xsm"));

  const [sortName, setSortName] = useState<string>("");
  const [sortDesc, setSortDesc] = useState<boolean>(false);

  const {
    bridge,
    isTestnet,
    baseAssetSymbol,
    name: networkName,
  } = currentNetworkConfig;

  const [isShowZeroAssets, setIsShowZeroAssets] = useState(
    localStorage.getItem(LOCAL_STORAGE_NAME) === "true"
  );

  const tokensToSupply = useMemo(
    () =>
      reserves
        .filter(
          (reserve: ComputedReserveData) =>
            !(reserve.isFrozen || reserve.isPaused)
        )
        .map((reserve: ComputedReserveData) => {
          const walletBalance = walletBalances[reserve.underlyingAsset]?.amount;
          const walletBalanceUSD =
            walletBalances[reserve.underlyingAsset]?.amountUSD;
          let availableToDeposit = valueToBigNumber(walletBalance);
          if (reserve.supplyCap !== "0") {
            availableToDeposit = BigNumber.min(
              availableToDeposit,
              new BigNumber(reserve.supplyCap)
                .minus(reserve.totalLiquidity)
                .multipliedBy("0.995")
            );
          }
          const availableToDepositUSD = valueToBigNumber(availableToDeposit)
            .multipliedBy(reserve.priceInMarketReferenceCurrency)
            .multipliedBy(marketReferencePriceInUsd)
            .shiftedBy(-USD_DECIMALS)
            .toString();

          const isIsolated = reserve.isIsolated;
          const hasDifferentCollateral = user?.userReservesData.find(
            (userRes) =>
              userRes.usageAsCollateralEnabledOnUser &&
              userRes.reserve.id !== reserve.id
          );

          const usageAsCollateralEnabledOnUser = !user?.isInIsolationMode
            ? reserve.reserveLiquidationThreshold !== "0" &&
              (!isIsolated || (isIsolated && !hasDifferentCollateral))
            : !isIsolated
            ? false
            : !hasDifferentCollateral;

          if (reserve.isWrappedBaseAsset) {
            let baseAvailableToDeposit = valueToBigNumber(
              walletBalances[API_ETH_MOCK_ADDRESS.toLowerCase()]?.amount
            );
            if (reserve.supplyCap !== "0") {
              baseAvailableToDeposit = BigNumber.min(
                baseAvailableToDeposit,
                new BigNumber(reserve.supplyCap)
                  .minus(reserve.totalLiquidity)
                  .multipliedBy("0.995")
              );
            }
            const baseAvailableToDepositUSD = valueToBigNumber(
              baseAvailableToDeposit
            )
              .multipliedBy(reserve.priceInMarketReferenceCurrency)
              .multipliedBy(marketReferencePriceInUsd)
              .shiftedBy(-USD_DECIMALS)
              .toString();
            return [
              {
                ...reserve,
                reserve,
                underlyingAsset: API_ETH_MOCK_ADDRESS.toLowerCase(),
                ...fetchIconSymbolAndName({
                  name: reserve.name,
                  symbol: baseAssetSymbol,
                  underlyingAsset: API_ETH_MOCK_ADDRESS.toLowerCase(),
                }),
                walletBalance:
                  walletBalances[API_ETH_MOCK_ADDRESS.toLowerCase()]?.amount,
                walletBalanceUSD:
                  walletBalances[API_ETH_MOCK_ADDRESS.toLowerCase()]?.amountUSD,
                availableToDeposit: baseAvailableToDeposit.toString(),
                availableToDepositUSD: baseAvailableToDepositUSD,
                usageAsCollateralEnabledOnUser,
                detailsAddress: reserve.underlyingAsset,
                id: reserve.id + "base",
              },
              {
                ...reserve,
                reserve,
                walletBalance,
                walletBalanceUSD,
                availableToDeposit:
                  availableToDeposit.toNumber() <= 0
                    ? "0"
                    : availableToDeposit.toString(),
                availableToDepositUSD:
                  Number(availableToDepositUSD) <= 0
                    ? "0"
                    : availableToDepositUSD.toString(),
                usageAsCollateralEnabledOnUser,
                detailsAddress: reserve.underlyingAsset,
              },
            ];
          }

          return {
            ...reserve,
            reserve,
            walletBalance,
            walletBalanceUSD,
            availableToDeposit:
              availableToDeposit.toNumber() <= 0
                ? "0"
                : availableToDeposit.toString(),
            availableToDepositUSD:
              Number(availableToDepositUSD) <= 0
                ? "0"
                : availableToDepositUSD.toString(),
            usageAsCollateralEnabledOnUser,
            detailsAddress: reserve.underlyingAsset,
          };
        })
        .flat(),
    [reserves, walletBalances, user]
  );

  const sortedSupplyReserves = useMemo(
    () =>
      tokensToSupply.sort((a, b) =>
        +a.walletBalanceUSD > +b.walletBalanceUSD ? -1 : 1
      ),
    [tokensToSupply]
  );
  const filteredSupplyReserves = useMemo(
    () =>
      sortedSupplyReserves.filter(
        (reserve) => reserve.availableToDepositUSD !== "0"
      ),
    [sortedSupplyReserves]
  );

  // Filter out reserves
  const supplyReserves: unknown = isShowZeroAssets
    ? sortedSupplyReserves
    : filteredSupplyReserves.length >= 1
    ? filteredSupplyReserves
    : sortedSupplyReserves;

  // Transform to the DashboardReserve schema so the sort utils can work with it
  const preSortedReserves = supplyReserves as DashboardReserve[];
  const sortedReserves = handleSortDashboardReserves(
    sortDesc,
    sortName,
    "assets",
    preSortedReserves
  );

  const RenderHeader: FC = useCallback(() => {
    return (
      <ListHeaderWrapper>
        {head.map((col) => (
          <ListColumn
            isRow={col.sortKey === "symbol"}
            maxWidth={
              col.sortKey === "symbol"
                ? DASHBOARD_LIST_COLUMN_WIDTHS.ASSET
                : undefined
            }
            key={col.sortKey}
            overFlow={"visible"}
          >
            <ListHeaderTitle
              sortName={sortName}
              sortDesc={sortDesc}
              setSortName={setSortName}
              setSortDesc={setSortDesc}
              sortKey={col.sortKey}
              source="Supplies Dashbaord"
            >
              {col.title}
            </ListHeaderTitle>
          </ListColumn>
        ))}
        <ListButtonsColumn isColumnHeader />
      </ListHeaderWrapper>
    );
  }, [sortName, sortDesc, setSortName, setSortDesc]);

  if (loadingReserves || loading)
    return (
      <ListLoader
        head={head.map((col) => col.title)}
        title={"Assets to supply"}
        withTopMargin
      />
    );

  const supplyDisabled = !tokensToSupply.length;

  return (
    <ListWrapper
      titleComponent={
        <Typography
          component="div"
          variant="h3"
          sx={{ mr: 2 }}
          color={theme.palette.text.primary}
        >
          Assets to supply
        </Typography>
      }
      localStorageName="supplyAssetsDashboardTableCollapse"
      withTopMargin
      noData={supplyDisabled}
      subChildrenComponent={
        <>
          <Box sx={{ px: 3 }}>
            {user?.isInIsolationMode ? (
              <Warning severity="warning">
                Collateral usage is limited because of isolation mode.
              </Warning>
            ) : (
              filteredSupplyReserves.length === 0 &&
              (isTestnet ? (
                <Warning severity="info">
                  Your {networkName} wallet is empty. Get free test assets at{" "}
                  <Link href={ROUTES.faucet} style={{ fontWeight: 400 }}>
                    {networkName} Faucet
                  </Link>
                </Warning>
              ) : (
                <WalletEmptyInfo
                  name={networkName}
                  bridge={bridge}
                  chainId={currentChainId}
                />
              ))
            )}
          </Box>

          {filteredSupplyReserves.length >= 1 && (
            <DashboardListTopPanel
              value={isShowZeroAssets}
              onClick={setIsShowZeroAssets}
              localStorageName={LOCAL_STORAGE_NAME}
              bridge={bridge}
            />
          )}
        </>
      }
    >
      <>
        {!downToXSM && !!sortedReserves && !supplyDisabled && <RenderHeader />}
        {sortedReserves.map((item) => (
          <Fragment key={item.underlyingAsset}>
            <AssetCapsProvider asset={item.reserve}>
              {downToXSM ? (
                <SupplyAssetsListMobileItem {...item} key={item.id} />
              ) : (
                <SupplyAssetsListItem {...item} key={item.id} />
              )}
            </AssetCapsProvider>
          </Fragment>
        ))}
      </>
    </ListWrapper>
  );
};
