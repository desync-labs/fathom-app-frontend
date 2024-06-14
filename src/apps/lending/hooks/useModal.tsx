import { InterestRate } from "@into-the-fathom/lending-contract-helpers";
import { createContext, FC, ReactNode, useContext, useState } from "react";
import { EmodeModalType } from "apps/lending/components/transactions/Emode/EmodeModalContent";
import { useWeb3Context } from "apps/lending/libs/hooks/useWeb3Context";
import { useRootStore } from "apps/lending/store/root";
import { TxErrorType } from "apps/lending/ui-config/errorMapping";
import { GENERAL } from "apps/lending/utils/mixPanelEvents";

export enum ModalType {
  Supply,
  Withdraw,
  Borrow,
  Repay,
  CollateralChange,
  RateSwitch,
  ClaimRewards,
  Emode,
  Faucet,
  Swap,
  DebtSwitch,
}

export interface ModalArgsType {
  underlyingAsset?: string;
  proposalId?: number;
  support?: boolean;
  power?: string;
  icon?: string;
  currentRateMode?: InterestRate;
  emode?: EmodeModalType;
  isFrozen?: boolean;
}

export type TxStateType = {
  txHash?: string;
  // txError?: string;
  loading?: boolean;
  success?: boolean;
};

export interface ModalContextType<T extends ModalArgsType> {
  openSupply: (
    underlyingAsset: string,
    currentMarket: string,
    name: string,
    funnel: string,
    isReserve?: boolean
  ) => void;
  openWithdraw: (
    underlyingAsset: string,
    currentMarket: string,
    name: string,
    funnel: string
  ) => void;
  openBorrow: (
    underlyingAsset: string,
    currentMarket: string,
    name: string,
    funnel: string,
    isReserve?: boolean
  ) => void;
  openRepay: (
    underlyingAsset: string,
    currentRateMode: InterestRate,
    isFrozen: boolean,
    currentMarket: string,
    name: string,
    funnel: string
  ) => void;
  openCollateralChange: (
    underlyingAsset: string,
    currentMarket: string,
    name: string,
    funnel: string,
    usageAsCollateralEnabledOnUser: boolean
  ) => void;
  openRateSwitch: (
    underlyingAsset: string,
    currentRateMode: InterestRate
  ) => void;
  openDebtSwitch: (
    underlyingAsset: string,
    currentRateMode: InterestRate
  ) => void;
  openSwap: (underlyingAsset: string) => void;
  openEmode: (mode: EmodeModalType) => void;
  openFaucet: (underlyingAsset: string) => void;
  close: () => void;
  openClaimRewards: () => void;
  type?: ModalType;
  args: T;
  mainTxState: TxStateType;
  approvalTxState: TxStateType;
  requiresApproval: boolean;
  setApprovalTxState: (data: TxStateType) => void;
  setRequiresApproval: (requiresApproval: boolean) => void;
  setMainTxState: (data: TxStateType) => void;
  gasLimit: string;
  setGasLimit: (limit: string) => void;
  loadingTxns: boolean;
  setLoadingTxns: (loading: boolean) => void;
  txError: TxErrorType | undefined;
  setTxError: (error: TxErrorType | undefined) => void;
}

export const ModalContext = createContext<ModalContextType<ModalArgsType>>(
  {} as ModalContextType<ModalArgsType>
);

export const ModalContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { setSwitchNetworkError } = useWeb3Context();
  // contains the current modal open state if any
  const [type, setType] = useState<ModalType>();
  // contains arbitrary key-value pairs as a modal context
  const [args, setArgs] = useState<ModalArgsType>({});
  const [approvalTxState, setApprovalTxState] = useState<TxStateType>({});
  const [mainTxState, setMainTxState] = useState<TxStateType>({});
  const [gasLimit, setGasLimit] = useState<string>("");
  const [loadingTxns, setLoadingTxns] = useState<boolean>(false);
  const [txError, setTxError] = useState<TxErrorType>();
  const trackEvent = useRootStore((store) => store.trackEvent);
  const [requiresApproval, setRequiresApproval] = useState<boolean>(false);

  return (
    <ModalContext.Provider
      value={{
        openSupply: (
          underlyingAsset,
          currentMarket,
          name,
          funnel,
          isReserve
        ) => {
          setType(ModalType.Supply);
          setArgs({ underlyingAsset });
          setMainTxState({});

          if (isReserve) {
            trackEvent(GENERAL.OPEN_MODAL, {
              modal: "Supply",
              market: currentMarket,
              assetName: name,
              asset: underlyingAsset,
              funnel,
            });
          } else {
            trackEvent(GENERAL.OPEN_MODAL, {
              modal: "Supply",
              market: currentMarket,
              assetName: name,
              asset: underlyingAsset,
              funnel,
            });
          }
        },
        openWithdraw: (underlyingAsset, currentMarket, name, funnel) => {
          setType(ModalType.Withdraw);
          setArgs({ underlyingAsset });
          setMainTxState({});

          trackEvent(GENERAL.OPEN_MODAL, {
            modal: "Withdraw",
            market: currentMarket,
            assetName: name,
            asset: underlyingAsset,
            funnel: funnel,
          });
        },
        openDebtSwitch: (underlyingAsset, currentRateMode) => {
          trackEvent(GENERAL.OPEN_MODAL, {
            modal: "Debt Switch",
            asset: underlyingAsset,
          });
          setType(ModalType.DebtSwitch);
          setArgs({ underlyingAsset, currentRateMode });
        },
        openSwap: (underlyingAsset) => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: "Swap" });
          setType(ModalType.Swap);
          setArgs({ underlyingAsset });
        },
        openBorrow: (
          underlyingAsset,
          currentMarket,
          name,
          funnel,
          isReserve
        ) => {
          setType(ModalType.Borrow);
          setArgs({ underlyingAsset });
          setMainTxState({});

          if (isReserve) {
            trackEvent(GENERAL.OPEN_MODAL, {
              modal: "Borrow",
              market: currentMarket,
              assetName: name,
              asset: underlyingAsset,
              funnel,
            });
          } else {
            trackEvent(GENERAL.OPEN_MODAL, {
              modal: "Borrow",
              market: currentMarket,
              assetName: name,
              asset: underlyingAsset,
              funnel,
            });
          }
        },
        openRepay: (
          underlyingAsset,
          currentRateMode,
          isFrozen,
          currentMarket,
          name,
          funnel
        ) => {
          setType(ModalType.Repay);
          setArgs({ underlyingAsset, currentRateMode, isFrozen });
          setMainTxState({});

          trackEvent(GENERAL.OPEN_MODAL, {
            modal: "Repay",
            asset: underlyingAsset,
            assetName: name,
            market: currentMarket,
            funnel,
          });
        },
        openCollateralChange: (
          underlyingAsset,
          currentMarket,
          name,
          funnel,
          usageAsCollateralEnabledOnUser
        ) => {
          setType(ModalType.CollateralChange);
          setArgs({ underlyingAsset });
          setMainTxState({});

          trackEvent(GENERAL.OPEN_MODAL, {
            modal: "Toggle Collateral",
            market: currentMarket,
            assetName: name,
            asset: underlyingAsset,
            usageAsCollateralEnabledOnUser: usageAsCollateralEnabledOnUser,
            funnel,
          });
        },
        openRateSwitch: (underlyingAsset, currentRateMode) => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: "Rate Switch" });
          setType(ModalType.RateSwitch);
          setArgs({ underlyingAsset, currentRateMode });
          setMainTxState({});
        },
        openEmode: (mode) => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: "eMode" });
          setType(ModalType.Emode);
          setArgs({ emode: mode });
          setMainTxState({});
        },
        openClaimRewards: () => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: "Claim" });
          setType(ModalType.ClaimRewards);
        },
        openFaucet: (underlyingAsset) => {
          trackEvent(GENERAL.OPEN_MODAL, { modal: "Faucet" });
          setType(ModalType.Faucet);
          setArgs({ underlyingAsset });
          setMainTxState({});
        },
        close: () => {
          setType(undefined);
          setArgs({});
          setMainTxState({});
          setApprovalTxState({});
          setGasLimit("");
          setTxError(undefined);
          setSwitchNetworkError(undefined);
        },
        type,
        args,
        approvalTxState,
        requiresApproval,
        mainTxState,
        setApprovalTxState,
        setRequiresApproval,
        setMainTxState,
        gasLimit,
        setGasLimit,
        loadingTxns,
        setLoadingTxns,
        txError,
        setTxError,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);

  if (context === undefined) {
    throw new Error("useModalContext must be used within a ModalProvider");
  }

  return context;
};
