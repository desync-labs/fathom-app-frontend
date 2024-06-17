import { ChainId } from "@into-the-fathom/lending-contract-helpers";
import {
  normalize,
  UserIncentiveData,
} from "@into-the-fathom/lending-math-utils";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";
import { Row } from "apps/lending/components/primitives/Row";
import { TokenIcon } from "apps/lending/components/primitives/TokenIcon";
import { Reward } from "apps/lending//helpers/types";
import {
  ComputedReserveData,
  ExtendedFormattedUser,
} from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { useModalContext } from "apps/lending/hooks/useModal";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { useWeb3Context } from "apps/lending/libs/hooks/useWeb3Context";
import { getNetworkConfig } from "apps/lending/utils/marketsAndNetworksConfig";

import { TxErrorView } from "apps/lending/components/transactions/FlowCommons/Error";
import { GasEstimationError } from "apps/lending/components/transactions/FlowCommons/GasEstimationError";
import { TxSuccessView } from "apps/lending/components/transactions/FlowCommons/Success";
import {
  DetailsNumberLine,
  DetailsNumberLineWithSub,
  TxModalDetails,
} from "apps/lending/components/transactions/FlowCommons/TxModalDetails";
import { TxModalTitle } from "apps/lending/components/transactions/FlowCommons/TxModalTitle";
import { ChangeNetworkWarning } from "apps/lending/components/transactions/Warnings/ChangeNetworkWarning";
import { ClaimRewardsActions } from "apps/lending/components/transactions/ClaimRewards/ClaimRewardsActions";
import { RewardsSelect } from "./RewardsSelect";

export enum ErrorType {
  NOT_ENOUGH_BALANCE,
}

interface ClaimRewardsModalContentProps {
  user: ExtendedFormattedUser;
  reserves: ComputedReserveData[];
}

export const ClaimRewardsModalContent = ({
  user,
  reserves,
}: ClaimRewardsModalContentProps) => {
  const {
    gasLimit,
    mainTxState: claimRewardsTxState,
    txError,
  } = useModalContext();
  const { currentChainId, currentMarketData } = useProtocolDataContext();
  const { chainId: connectedChainId } = useWeb3Context();
  const [claimableUsd, setClaimableUsd] = useState("0");
  const [selectedRewardSymbol, setSelectedRewardSymbol] =
    useState<string>("all");
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [allReward, setAllReward] = useState<Reward>();

  const networkConfig = getNetworkConfig(currentChainId);

  // get all rewards
  useEffect(() => {
    const userIncentives: Reward[] = [];
    let totalClaimableUsd = Number(claimableUsd);
    const allAssets: string[] = [];
    Object.keys(user.calculatedUserIncentives).forEach((rewardTokenAddress) => {
      const incentive: UserIncentiveData =
        user.calculatedUserIncentives[rewardTokenAddress];
      const rewardBalance = normalize(
        incentive.claimableRewards,
        incentive.rewardTokenDecimals
      );

      let tokenPrice = 0;
      // getting price from reserves for the native rewards for v2 markets
      if (!currentMarketData.v3 && Number(rewardBalance) > 0) {
        if (currentMarketData.chainId === ChainId.mainnet) {
          tokenPrice = 0;
        } else {
          reserves.forEach((reserve) => {
            if (reserve.isWrappedBaseAsset) {
              tokenPrice = Number(reserve.priceInUSD);
            }
          });
        }
      } else {
        tokenPrice = Number(incentive.rewardPriceFeed);
      }

      const rewardBalanceUsd = Number(rewardBalance) * tokenPrice;

      if (rewardBalanceUsd > 0) {
        incentive.assets.forEach((asset) => {
          if (allAssets.indexOf(asset) === -1) {
            allAssets.push(asset);
          }
        });

        userIncentives.push({
          assets: incentive.assets,
          incentiveControllerAddress: incentive.incentiveControllerAddress,
          symbol: incentive.rewardTokenSymbol,
          balance: rewardBalance,
          balanceUsd: rewardBalanceUsd.toString(),
          rewardTokenAddress,
        });

        totalClaimableUsd = totalClaimableUsd + Number(rewardBalanceUsd);
      }
    });

    if (userIncentives.length === 1) {
      setSelectedRewardSymbol(userIncentives[0].symbol);
    } else if (userIncentives.length > 1 && !selectedReward) {
      const allRewards = {
        assets: allAssets,
        incentiveControllerAddress:
          userIncentives[0].incentiveControllerAddress,
        symbol: "all",
        balance: "0",
        balanceUsd: totalClaimableUsd.toString(),
        rewardTokenAddress: "",
      };
      setSelectedRewardSymbol("all");
      setAllReward(allRewards);
    }

    setRewards(userIncentives);
    setClaimableUsd(totalClaimableUsd.toString());
  }, []);

  // error handling
  let blockingError: ErrorType | undefined = undefined;
  if (claimableUsd === "0") {
    blockingError = ErrorType.NOT_ENOUGH_BALANCE;
  }

  // error handling render
  const handleBlocked = () => {
    switch (blockingError) {
      case ErrorType.NOT_ENOUGH_BALANCE:
        return "Your reward balance is 0";
      default:
        return null;
    }
  };

  // is Network mismatched
  const isWrongNetwork = currentChainId !== connectedChainId;
  const selectedReward =
    selectedRewardSymbol === "all"
      ? allReward
      : rewards.find((r) => r.symbol === selectedRewardSymbol);

  if (txError && txError.blocking) {
    return <TxErrorView txError={txError} />;
  }
  if (claimRewardsTxState.success)
    return (
      <TxSuccessView action={"Claimed"} amount={selectedReward?.balanceUsd} />
    );

  return (
    <>
      <TxModalTitle title="Claim rewards" />
      {isWrongNetwork && (
        <ChangeNetworkWarning
          networkName={networkConfig.name}
          chainId={currentChainId}
        />
      )}

      {blockingError !== undefined && (
        <Typography variant="helperText" color="error.main">
          {handleBlocked()}
        </Typography>
      )}

      {rewards.length > 1 && (
        <RewardsSelect
          rewards={rewards}
          selectedReward={selectedRewardSymbol}
          setSelectedReward={setSelectedRewardSymbol}
        />
      )}

      {selectedReward && (
        <TxModalDetails gasLimit={gasLimit}>
          {selectedRewardSymbol === "all" && (
            <>
              <Row
                caption={"Balance"}
                captionVariant="description"
                align="flex-start"
                mb={selectedReward.symbol !== "all" ? 0 : 4}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  {rewards.map((reward) => (
                    <Box
                      key={`claim-${reward.symbol}`}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        mb: 4,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TokenIcon
                          symbol={reward.symbol}
                          sx={{ mr: 1, fontSize: "16px" }}
                        />
                        <FormattedNumber
                          value={Number(reward.balance)}
                          variant="secondary14"
                        />
                        <Typography ml={1} variant="secondary14">
                          {reward.symbol}
                        </Typography>
                      </Box>
                      <FormattedNumber
                        value={Number(reward.balanceUsd)}
                        variant="helperText"
                        compact
                        symbol="USD"
                        color="text.secondary"
                      />
                    </Box>
                  ))}
                </Box>
              </Row>
              <DetailsNumberLine
                description={"Total worth"}
                value={claimableUsd}
              />
            </>
          )}
          {selectedRewardSymbol !== "all" && (
            <DetailsNumberLineWithSub
              symbol={<TokenIcon symbol={selectedReward.symbol} />}
              futureValue={selectedReward.balance}
              futureValueUSD={selectedReward.balanceUsd}
              description={<>{selectedReward.symbol} Balance</>}
            />
          )}
        </TxModalDetails>
      )}

      {txError && <GasEstimationError txError={txError} />}

      <ClaimRewardsActions
        isWrongNetwork={isWrongNetwork}
        selectedReward={selectedReward ?? ({} as Reward)}
        blocked={blockingError !== undefined}
      />
    </>
  );
};
