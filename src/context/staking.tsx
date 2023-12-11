import {
  ChangeEvent,
  createContext,
  FC,
  ReactElement,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import useStakingView, {
  ActionType,
  DialogActions,
} from "hooks/useStakingView";
import { ChainId } from "connectors/networks";
import { ILockPosition } from "fathom-sdk";

type StakingProviderType = {
  children: ReactElement;
};

type UseStakingReturnType = {
  isMobile: boolean;
  account: string | null | undefined;
  chainId: ChainId;
  action: ActionType | undefined;
  isLoading: boolean;
  isUnlockable: (remainingTime: number) => boolean;
  withdrawAll: (callback: Function) => Promise<void>;
  claimRewards: (callback: Function) => Promise<void>;
  handleEarlyUnstake: (lockId: number) => Promise<number | Error>;
  handleUnlock: (lockId: number, amount: number) => Promise<number | Error>;
  unstake: ILockPosition | null;
  earlyUnstake: ILockPosition | null;
  dialogAction: DialogActions;
  setDialogAction: Dispatch<SetStateAction<DialogActions>>;
  totalRewards: string;
  previousTotalRewards: string;
  setUnstake: Dispatch<SetStateAction<ILockPosition | null>>;
  setEarlyUnstake: Dispatch<SetStateAction<ILockPosition | null>>;
  onClose: () => void;
  processFlow: (action: string, position?: ILockPosition) => void;
  stake: any;
  previousStake: any;
  lockPositions: ILockPosition[];
  protocolStatsInfo: any;
  itemCount: number;
  currentPage: number;
  handlePageChange: (event: ChangeEvent<unknown>, page: number) => void;
};

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
