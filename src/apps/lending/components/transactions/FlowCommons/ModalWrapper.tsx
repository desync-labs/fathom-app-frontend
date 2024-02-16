import {
  API_ETH_MOCK_ADDRESS,
  PERMISSION,
} from "@into-the-fathom/lending-contract-helpers";
import { FC, ReactElement, ReactNode } from "react";
import {
  ComputedReserveData,
  ComputedUserReserveData,
  useAppDataContext,
} from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { useWalletBalances } from "apps/lending/hooks/app-data-provider/useWalletBalances";
import { AssetCapsProvider } from "apps/lending/hooks/useAssetCaps";
import { useIsWrongNetwork } from "apps/lending/hooks/useIsWrongNetwork";
import { useModalContext } from "apps/lending/hooks/useModal";
import { usePermissions } from "apps/lending/hooks/usePermissions";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import {
  getNetworkConfig,
  isFeatureEnabled,
} from "apps/lending/utils/marketsAndNetworksConfig";
import { GENERAL } from "apps/lending/utils/mixPanelEvents";

import { TxModalTitle } from "apps/lending/components/transactions/FlowCommons/TxModalTitle";
import { ChangeNetworkWarning } from "apps/lending/components/transactions//Warnings/ChangeNetworkWarning";
import { TxErrorView } from "apps/lending/components/transactions/FlowCommons/Error";

export interface ModalWrapperProps {
  underlyingAsset: string;
  poolReserve: ComputedReserveData;
  userReserve: ComputedUserReserveData;
  symbol: string;
  tokenBalance: string;
  nativeBalance: string;
  isWrongNetwork: boolean;
  action?: string;
}

export const ModalWrapper: FC<{
  underlyingAsset: string;
  title: ReactElement;
  requiredChainId?: number;
  // if true wETH will stay wETH otherwise wETH will be returned as ETH
  keepWrappedSymbol?: boolean;
  hideTitleSymbol?: boolean;
  requiredPermission?: PERMISSION;
  children: (props: ModalWrapperProps) => ReactNode;
  action?: string;
}> = ({
  hideTitleSymbol,
  underlyingAsset,
  children,
  requiredChainId: _requiredChainId,
  title,
  requiredPermission,
  keepWrappedSymbol,
}) => {
  const { walletBalances } = useWalletBalances();
  const { currentNetworkConfig, currentMarketData } = useProtocolDataContext();
  const { user, reserves } = useAppDataContext();
  const { txError, mainTxState } = useModalContext();
  const { permissions } = usePermissions();

  const { isWrongNetwork, requiredChainId } =
    useIsWrongNetwork(_requiredChainId);

  if (txError && txError.blocking) {
    return <TxErrorView txError={txError} />;
  }

  if (
    requiredPermission &&
    isFeatureEnabled.permissions(currentMarketData) &&
    !permissions.includes(requiredPermission) &&
    currentMarketData.permissionComponent
  ) {
    return <>{currentMarketData.permissionComponent}</>;
  }

  const poolReserve = reserves.find((reserve) => {
    if (underlyingAsset.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase())
      return reserve.isWrappedBaseAsset;
    return underlyingAsset === reserve.underlyingAsset;
  }) as ComputedReserveData;

  const userReserve = user?.userReservesData.find((userReserve) => {
    if (underlyingAsset.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase())
      return userReserve.reserve.isWrappedBaseAsset;
    return underlyingAsset === userReserve.underlyingAsset;
  }) as ComputedUserReserveData;

  const symbol =
    poolReserve.isWrappedBaseAsset && !keepWrappedSymbol
      ? currentNetworkConfig.baseAssetSymbol
      : poolReserve.symbol;

  return (
    <AssetCapsProvider asset={poolReserve}>
      {!mainTxState.success && (
        <TxModalTitle
          title={title}
          symbol={hideTitleSymbol ? undefined : symbol}
        />
      )}
      {isWrongNetwork && (
        <ChangeNetworkWarning
          networkName={getNetworkConfig(requiredChainId).name}
          chainId={requiredChainId}
          event={{
            eventName: GENERAL.SWITCH_NETWORK,
            eventParams: {
              asset: underlyingAsset,
            },
          }}
        />
      )}
      {children({
        isWrongNetwork,
        nativeBalance:
          walletBalances[API_ETH_MOCK_ADDRESS.toLowerCase()]?.amount || "0",
        tokenBalance:
          walletBalances[poolReserve.underlyingAsset.toLowerCase()]?.amount ||
          "0",
        poolReserve,
        symbol,
        underlyingAsset,
        userReserve,
      })}
    </AssetCapsProvider>
  );
};
