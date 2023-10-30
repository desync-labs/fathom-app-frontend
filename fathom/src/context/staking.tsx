import { ChangeEvent, createContext, FC, ReactElement, useContext } from "react";
import useStakingView, { ActionType, DialogActions } from "hooks/useStakingView";
import { ChainId } from "connectors/networks";
import ILockPosition from "stores/interfaces/ILockPosition";

type StakingProviderType = {
  children: ReactElement;
};

type UseStakingReturnType = {
  isMobile: boolean,
  account: string | null | undefined,
  chainId: ChainId,
  action: ActionType | undefined,
  isLoading: boolean,
  isUnlockable: (remainingTime: number) => boolean,
  withdrawAll: (callback: Function) => Promise<void>,
  claimRewards: (callback: Function) => Promise<void>,
  handleEarlyUnstake: (lockId: number) => Promise<number>,
  handleUnlock: (lockId: number, amount: number) => Promise<number>,
  unstake: ILockPosition | null,
  earlyUnstake: ILockPosition | null,
  dialogAction: DialogActions,
  setDialogAction: React.Dispatch<React.SetStateAction<DialogActions>>,
  totalRewards: number,
  previousTotalRewards: number,
  setUnstake: React.Dispatch<React.SetStateAction<ILockPosition | null>>,
  setEarlyUnstake: React.Dispatch<React.SetStateAction<ILockPosition | null>>,
  onClose: () => void,
  processFlow: (action: string, position?: ILockPosition) => void,
  staker: any,
  previousStaker: any,
  lockPositions: ILockPosition[],
  protocolStatsInfo: any,
  itemCount: number,
  currentPage: number,
  handlePageChange: (event: ChangeEvent<unknown>, page: number) => void,
};

// @ts-ignore
export const StakingContext = createContext<UseStakingReturnType>(
  {} as UseStakingReturnType
);

export const StakingProvider: FC<StakingProviderType> = ({ children }) => {
  const values = useStakingView();

  return (
    <StakingContext.Provider value={values}>{children}</StakingContext.Provider>
  );
};

const useStakingContext = () => {
  const context = useContext(StakingContext);

  if (!context) {
    throw new Error(
      "useStakingContext hook must be used with a StakingContext component"
    );
  }

  return context;
};

export default useStakingContext;
