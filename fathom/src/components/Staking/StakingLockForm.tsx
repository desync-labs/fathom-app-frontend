import {
  Box,
  Button,
  Slider,
  TextField,
  Grid,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { FC, useCallback, useEffect, useState } from "react";
import useMetaMask from "../../hooks/metamask";
import { useStores } from "../../stores";
import debounce from 'lodash.debounce';

type StakingLockFormPropsType = {
  fetchOverallValues: (account: string, chainId: number) => Promise<void>;
};

const StakingLockForm: FC<StakingLockFormPropsType> = ({
  fetchOverallValues,
}) => {
  const { handleSubmit, watch, control, reset, getValues } = useForm({
    defaultValues: {
      lockDays: 30,
      stakePosition: 0,
    },
  });
  const { account, chainId } = useMetaMask()!;
  const rootStore = useStores();

  const lockDays = watch("lockDays");
  const stakePosition = watch("stakePosition");

  const stakingStore = rootStore.stakingStore;
  const [approvedBtn, setApprovedBtn] = useState(false);
  const [approvalPending, setApprovalPending] = useState(false);

  const approvalStatus = useCallback(
    debounce(async (account: string, chainId: number, stakePosition: number) => {
      const approved = await stakingStore.approvalStatusStakingFTHM(
        account,
        stakePosition,
        chainId
      );

      console.log('Approve', approved);
      approved ? setApprovedBtn(false) : setApprovedBtn(true);
    }, 1000),
    [stakingStore, setApprovedBtn, getValues]
  );

  useEffect(() => {
    if (chainId && stakePosition) {
      approvalStatus(account, chainId, stakePosition!);
    }
  }, [account, chainId, approvalStatus, stakePosition]);

  const onSubmit = useCallback(
    async (values: Record<string, any>) => {
      const { stakePosition, lockDays } = values;

      await stakingStore.createLock(account, stakePosition, lockDays, chainId);
      await stakingStore.fetchLatestLock(account, chainId);
      reset();
      fetchOverallValues(account, chainId);
    },
    [stakingStore, account, chainId, fetchOverallValues, reset]
  );

  const approveFTHM = useCallback(async () => {
    setApprovalPending(true);
    try {
      await stakingStore.approveFTHM(account, chainId);
      setApprovedBtn(false);
    } catch (e) {
      setApprovedBtn(true);
    }

    setApprovalPending(false);
  }, [setApprovalPending, setApprovedBtn, account, chainId, stakingStore]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="stakePosition"
        rules={{ required: true, min: 1 }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextField
            error={!!error}
            id="outlined-helperText"
            label="Stake Position"
            helperText="FTHM to stake"
            sx={{ m: 3 }}
            value={value}
            onChange={onChange}
          />
        )}
      />
      <Box sx={{ m: 3, mr: 10 }}>
        Unlock Period:
        <Controller
          control={control}
          name="lockDays"
          render={({ field: { onChange, value } }) => (
            <Slider
              aria-label="Temperature"
              valueLabelDisplay="auto"
              step={1}
              min={0}
              max={365}
              value={value}
              onChange={onChange}
            />
          )}
        />
        {lockDays} days
      </Box>
      <Grid container>
        <Button sx={{ m: 3, mr: 10 }} variant="outlined" type="submit">
          Create Lock
        </Button>

        <Grid xs={7}>
          {approvalPending ? (
            <Typography display="inline" sx={{ marginRight: 2 }}>
              Pending ...
            </Typography>
          ) : approvedBtn ? (
            <Button
              variant="outlined"
              onClick={approveFTHM}
              sx={{ m: 3, mr: 10 }}
            >
              Approve FTHM
            </Button>
          ) : null}
        </Grid>
      </Grid>
    </form>
  );
};

export default StakingLockForm;
