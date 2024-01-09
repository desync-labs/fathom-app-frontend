import loadable from "@loadable/component";
import { FC, memo, useMemo } from "react";
import { ILockPosition } from "fathom-sdk";
const StakingViewItem = loadable(() => import("../Staking/StakingViewItem"));
const ClaimRewardsDialog = loadable(
  () => import("../Staking/Dialog/ClaimRewardsDialog")
);
import { DialogActions } from "hooks/useStakingView";
const UnstakeDialog = loadable(() => import("../Staking/Dialog/UnstakeDialog"));
const EarlyUnstakeDialog = loadable(
  () => import("../Staking/Dialog/EarlyUnstakeDialog")
);
import { NoResults } from "components/AppComponents/AppBox/AppBox";
import { Box, CircularProgress, Grid, Pagination } from "@mui/material";
const UnclaimedRewardsDialog = loadable(
  () => import("../Staking/Dialog/UnclaimedRewardsDialog")
);
import useStakingContext from "context/staking";
const UnstakeCoolDownDialog = loadable(
  () => import("../Staking/Dialog/UnstakeCoolDownDialog")
);
const ClaimRewardsCoolDownDialog = loadable(
  () => import("../Staking/Dialog/ClaimRewardsCoolDownDialog")
);
const WithdrawDialog = loadable(
  () => import("../Staking/Dialog/WithdrawDialog")
);
import { COUNT_PER_PAGE } from "utils/Constants";
import { styled } from "@mui/material/styles";

const PaginationWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

type StreamItemProps = {
  token: string;
};

const StreamItem: FC<StreamItemProps> = ({ token }) => {
  const {
    lockPositions,
    totalRewards,
    previousTotalRewards,
    dialogAction,
    unstake,
    earlyUnstake,
    onClose,
    processFlow,
    itemCount,
    currentPage,
    handlePageChange,
    isLoading,
  } = useStakingContext();

  return (
    <>
      {useMemo(
        () => (
          <>
            {!isLoading && !lockPositions.length ? (
              <NoResults variant="h6">You have no open positions!</NoResults>
            ) : isLoading ? (
              <Grid container>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <CircularProgress size={30} />
                </Grid>
              </Grid>
            ) : (
              <Grid container sx={{ gap: "12px" }}>
                {lockPositions.map((lockPosition: ILockPosition) => (
                  <StakingViewItem
                    key={lockPosition.lockId}
                    token={token}
                    lockPosition={lockPosition}
                  />
                ))}
              </Grid>
            )}
            {itemCount > COUNT_PER_PAGE && (
              <PaginationWrapper>
                <Pagination
                  count={Math.ceil(itemCount / COUNT_PER_PAGE)}
                  page={currentPage}
                  onChange={handlePageChange}
                />
              </PaginationWrapper>
            )}
          </>
        ),
        [
          token,
          lockPositions,
          currentPage,
          itemCount,
          handlePageChange,
          isLoading,
        ]
      )}

      {useMemo(() => {
        return (
          dialogAction === DialogActions.CLAIM_REWARDS && (
            <ClaimRewardsDialog
              token={token}
              totalRewards={totalRewards}
              onClose={onClose}
              onSkip={
                unstake || earlyUnstake ? () => processFlow("skip") : null
              }
              onClaim={() => processFlow("claim-cooldown")}
            />
          )
        );
      }, [
        totalRewards,
        unstake,
        earlyUnstake,
        token,
        dialogAction,
        onClose,
        processFlow,
      ])}

      {useMemo(() => {
        return (
          dialogAction === DialogActions.CLAIM_REWARDS_COOLDOWN && (
            <ClaimRewardsCoolDownDialog
              totalRewards={previousTotalRewards}
              token={token}
              onClose={onClose}
              onContinue={
                unstake || earlyUnstake ? () => processFlow("continue") : null
              }
            />
          )
        );
      }, [
        previousTotalRewards,
        token,
        dialogAction,
        onClose,
        processFlow,
        unstake,
        earlyUnstake,
      ])}

      {useMemo(() => {
        return (
          dialogAction === DialogActions.UNSTAKE_COOLDOWN && (
            <UnstakeCoolDownDialog
              position={(unstake || earlyUnstake) as ILockPosition}
              token={token}
              onClose={onClose}
            />
          )
        );
      }, [unstake, earlyUnstake, dialogAction, token, onClose])}

      {useMemo(
        () =>
          dialogAction === DialogActions.UNSTAKE && (
            <UnstakeDialog
              onClose={onClose}
              token={token}
              lockPosition={unstake}
              onFinish={(unstakeAmount: number) => {
                processFlow("unstake-cooldown-unstake", {
                  ...unstake,
                  amount: unstakeAmount * 10 ** 18,
                } as ILockPosition);
              }}
            />
          ),
        [unstake, token, dialogAction, onClose, processFlow]
      )}

      {useMemo(
        () =>
          dialogAction === DialogActions.EARLY_UNSTAKE && (
            <EarlyUnstakeDialog
              token={token}
              onClose={onClose}
              lockPosition={earlyUnstake as ILockPosition}
              onFinish={(unstakeAmount) => {
                processFlow("unstake-cooldown-early-unstake", {
                  ...earlyUnstake,
                  amount: unstakeAmount,
                } as ILockPosition);
              }}
            />
          ),
        [token, dialogAction, earlyUnstake, onClose, processFlow]
      )}

      {useMemo(() => {
        return (
          dialogAction === DialogActions.UNCLAIMED && (
            <UnclaimedRewardsDialog
              position={(unstake || earlyUnstake) as ILockPosition}
              token={token}
              onClose={onClose}
              onSkip={() => processFlow("skip")}
              onClaim={() => processFlow("claim")}
            />
          )
        );
      }, [unstake, earlyUnstake, token, dialogAction, onClose, processFlow])}

      {useMemo(() => {
        return (
          dialogAction === DialogActions.WITHDRAW && (
            <WithdrawDialog token={token} onClose={onClose} />
          )
        );
      }, [dialogAction, token, onClose])}
    </>
  );
};

export default memo(StreamItem);
