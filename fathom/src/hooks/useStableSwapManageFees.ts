import {
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useStores } from "context/services";
import useSyncContext from "context/sync";
import {
  useCallback,
  useEffect,
  useState
} from "react";
import useConnector from "context/connector";


const useStableSwapManageFees = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { account, library } = useConnector()!;

  const [feesRewardsForFXD, setFeesRewardsForFXD] = useState<number>(0);
  const [feesRewardsForUSDTx, setFeesRewardsForUSDTx] = useState<number>(0);
  const [claimedFXDFeeReward, setClaimedFXDFeeReward] = useState<number>(0);
  const [claimedUSDTFeeReward, setClaimedUSDTFeeReward] = useState<number>(0);

  const [claimRewardsInProgress, setClaimRewardsInProgress] = useState<boolean>(false);
  const [withdrawClaimedFeesInProgress, setWithdrawClaimedFeesInProgress] = useState<boolean>(false);

  const { stableSwapService } = useStores();
  const { setLastTransactionBlock } = useSyncContext();


  const fetchData = useCallback(() => {
    if (account && library) {
      stableSwapService.getClaimableFeesPerUser(account, library).then((response) => {
        const { 0: feesRewardsForFXD, 1: feesRewardsForUSDTx } = response;
        setFeesRewardsForFXD(feesRewardsForFXD);
        setFeesRewardsForUSDTx(feesRewardsForUSDTx);
      });

      stableSwapService.getClaimedFXDFeeRewards(account, library).then((claimedFXDFeeReward) => {
        setClaimedFXDFeeReward(claimedFXDFeeReward);
      });
      stableSwapService.getClaimedTokenFeeRewards(account, library).then((claimedUSDTFeeReward) => {
        setClaimedUSDTFeeReward(claimedUSDTFeeReward);
      });
    }
  }, [account, library, stableSwapService, setFeesRewardsForFXD, setFeesRewardsForUSDTx]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const claimFeesRewards = useCallback(() => {
    if (account && library) {
      setClaimRewardsInProgress(true);
      stableSwapService.claimFeesRewards(account, library).then((blockNumber) => {
        setLastTransactionBlock(blockNumber as number);
      }).finally(() => {
        setClaimRewardsInProgress(false);
        fetchData();
      });
    }
  }, [account, library, setLastTransactionBlock, stableSwapService, fetchData]);

  const withdrawClaimedFees = useCallback(() => {
    if (account && library) {
      setWithdrawClaimedFeesInProgress(true);
      stableSwapService.withdrawClaimedFees(account, library).then((blockNumber) => {
        setLastTransactionBlock(blockNumber as number);
      }).finally(() => {
        setWithdrawClaimedFeesInProgress(false);
        fetchData();
      });
    }
  }, [account, library, setLastTransactionBlock, stableSwapService, fetchData]);

  return {
    feesRewardsForFXD,
    feesRewardsForUSDTx,
    claimedFXDFeeReward,
    claimedUSDTFeeReward,
    isMobile,
    claimRewardsInProgress,
    withdrawClaimedFeesInProgress,
    claimFeesRewards,
    withdrawClaimedFees
  };
};

export default useStableSwapManageFees;