import {
  ModalContextType,
  ModalType,
  useModalContext,
} from "apps/lending/hooks/useModal";

import { BasicModal } from "apps/lending/components/primitives/BasicModal";
import { ModalWrapper } from "apps/lending/components/transactions/FlowCommons/ModalWrapper";
import { CollateralChangeModalContent } from "./CollateralChangeModalContent";
import { API_ETH_MOCK_ADDRESS } from "@into-the-fathom/lending-contract-helpers";
import {
  ComputedReserveData,
  ComputedUserReserveData,
  useAppDataContext,
} from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";

const CollateralChangeModal = () => {
  const {
    type,
    close,
    args: { underlyingAsset },
  } = useModalContext() as ModalContextType<{
    underlyingAsset: string;
  }>;

  const { user, reserves } = useAppDataContext();
  const userReserve = user?.userReservesData.find((userReserve) => {
    if (underlyingAsset?.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase())
      return userReserve.reserve.isWrappedBaseAsset;
    return underlyingAsset === userReserve.underlyingAsset;
  }) as ComputedUserReserveData;

  const poolReserve = reserves.find((reserve) => {
    if (underlyingAsset?.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase())
      return reserve.isWrappedBaseAsset;
    return underlyingAsset === reserve.underlyingAsset;
  }) as ComputedReserveData;

  const { currentNetworkConfig } = useProtocolDataContext();

  const symbol = poolReserve?.isWrappedBaseAsset
    ? currentNetworkConfig?.baseAssetSymbol
    : poolReserve?.symbol;

  return (
    <BasicModal open={type === ModalType.CollateralChange} setOpen={close}>
      <ModalWrapper
        hideTitleSymbol={true}
        title={
          !userReserve?.usageAsCollateralEnabledOnUser ? (
            <>Enable {symbol} as collateral</>
          ) : (
            <>Disable {symbol} as collateral</>
          )
        }
        underlyingAsset={underlyingAsset}
      >
        {(params) => <CollateralChangeModalContent {...params} />}
      </ModalWrapper>
    </BasicModal>
  );
};

export default CollateralChangeModal;
