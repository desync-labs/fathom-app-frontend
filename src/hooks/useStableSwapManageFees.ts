import { useServices } from "context/services";
import useSyncContext from "context/sync";
import { useCallback, useEffect, useState } from "react";
import useConnector from "context/connector";
import { SmartContractFactory } from "fathom-sdk";

const useStableSwapManageFees = () => {
  const { account, library, chainId } = useConnector();

  const [feesRewardsForFXD, setFeesRewardsForFXD] = useState<string>("0");
  const [feesRewardsForUSDTx, setFeesRewardsForUSDTx] = useState<string>("0");
  const [claimedFXDFeeReward, setClaimedFXDFeeReward] = useState<string>("0");
  const [claimedUSDTFeeReward, setClaimedUSDTFeeReward] = useState<string>("0");

  const [fxdDecimals, setFxdDecimals] = useState<string>("0");
  const [stableDecimals, setStableDecimals] = useState<string>("0");

  const [claimRewardsInProgress, setClaimRewardsInProgress] =
    useState<boolean>(false);
  const [withdrawClaimedFeesInProgress, setWithdrawClaimedFeesInProgress] =
    useState<boolean>(false);

  const { stableSwapService, poolService } = useServices();
  const { setLastTransactionBlock } = useSyncContext();

  const fetchData = useCallback(() => {
    if (account && library) {
      const FXDContractAddress = SmartContractFactory.getAddressByContractName(
        chainId,
        "FXD"
      );

      const UsStableContractAddress =
        SmartContractFactory.getAddressByContractName(chainId, "xUSDT");

      const promises = [];
      promises.push(poolService.getTokenDecimals(FXDContractAddress));
      promises.push(poolService.getTokenDecimals(UsStableContractAddress));
      promises.push(stableSwapService.getClaimableFeesPerUser(account));

      Promise.all(promises).then(
        ([fxdDecimal, stableDecimal, claimableFeesData]) => {
          const { 0: feesRewardsForFXD, 1: feesRewardsForUSDTx } =
            claimableFeesData as any;

          console.log({
            feesRewardsForFXD: feesRewardsForFXD.toString(),
            feesRewardsForUSDTx: feesRewardsForUSDTx.toString(),
          });
          setFeesRewardsForFXD(feesRewardsForFXD.toString());
          setFeesRewardsForUSDTx(feesRewardsForUSDTx.toString());
          setFxdDecimals(fxdDecimal.toString());
          setStableDecimals(stableDecimal.toString());
        }
      );

      stableSwapService
        .getClaimedFXDFeeRewards(account)
        .then((claimedFXDFeeReward) => {
          setClaimedFXDFeeReward(claimedFXDFeeReward.toString());
        });
      stableSwapService
        .getClaimedTokenFeeRewards(account)
        .then((claimedUSDTFeeReward) => {
          setClaimedUSDTFeeReward(claimedUSDTFeeReward.toString());
        });
    }
  }, [
    account,
    chainId,
    library,
    stableSwapService,
    setFeesRewardsForFXD,
    setFeesRewardsForUSDTx,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const claimFeesRewards = useCallback(() => {
    if (account && library) {
      setClaimRewardsInProgress(true);
      stableSwapService
        .claimFeesRewards(account)
        .then((blockNumber) => {
          setLastTransactionBlock(blockNumber as number);
        })
        .finally(() => {
          setClaimRewardsInProgress(false);
          fetchData();
        });
    }
  }, [account, library, setLastTransactionBlock, stableSwapService, fetchData]);

  const withdrawClaimedFees = useCallback(() => {
    if (account && library) {
      setWithdrawClaimedFeesInProgress(true);
      stableSwapService
        .withdrawClaimedFees(account)
        .then((blockNumber) => {
          setLastTransactionBlock(blockNumber as number);
        })
        .finally(() => {
          setWithdrawClaimedFeesInProgress(false);
          fetchData();
        });
    }
  }, [account, library, setLastTransactionBlock, stableSwapService, fetchData]);

  return {
    fxdDecimals,
    stableDecimals,
    feesRewardsForFXD,
    feesRewardsForUSDTx,
    claimedFXDFeeReward,
    claimedUSDTFeeReward,
    claimRewardsInProgress,
    withdrawClaimedFeesInProgress,
    claimFeesRewards,
    withdrawClaimedFees,
  };
};

export default useStableSwapManageFees;
