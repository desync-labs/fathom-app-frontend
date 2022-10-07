import { Box, Button, Slider, TextField,Grid, Typography } from "@mui/material";
import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { FC, useCallback } from "react";
import useMetaMask from "../../hooks/metamask";
import { useStores } from "../../stores";



type StakingLockFormPropsType = {
  fetchAll: (account: string, chainId: number) => Promise<void>;
  fetchOverallValues: (account: string, chainId: number) => Promise<void>;
};

const StakingLockForm: FC<StakingLockFormPropsType> = ({ fetchAll,fetchOverallValues }) => {
  const {
    handleSubmit,
    watch,
    control,
    reset,
    getValues
  } = useForm({
    defaultValues: {
      lockDays: 30,
      stakePosition: null,
    },
  });
  const { account, chainId } = useMetaMask()!;
  const rootStore = useStores();

  const lockDays = watch("lockDays");

  const stakingStore = rootStore.stakingStore;
  const [approvedBtn, setApprovedBtn] = React.useState(false);
  const [approvalPending, setApprovalPending] = React.useState(false);
  
  const approvalStatus = useCallback(async (account:string,chainId:number) => {
    let approved;
    let input = getValues("stakePosition") || 0;
    approved = await stakingStore.approvalStatusStakingFTHM(account,input,chainId)
    approved ? setApprovedBtn(false) : setApprovedBtn(true);
  },[ stakingStore, setApprovedBtn, getValues])

  React.useEffect(() => {
    if (chainId) { 
        approvalStatus(account,chainId)
    } else {
      stakingStore.setLocks([]);
    }
  }, [account, stakingStore, chainId, approvalStatus]);


  const onSubmit = useCallback(
    async (values: Record<string, any>) => {
      const { stakePosition, lockDays } = values;

      await stakingStore.createLock(account, stakePosition, lockDays, chainId);
      await stakingStore.fetchLatestLock(account,chainId)
      reset();
      fetchOverallValues(account, chainId);
    },
    [stakingStore, account, chainId,fetchOverallValues, reset]
  );

  const approveFTHM =  async () => {
    setApprovalPending(true);
    try{
      await stakingStore.approveFTHM(account,chainId)
      setApprovedBtn(false);
    }catch(e){
      setApprovedBtn(true)
    }

    setApprovalPending(false);
  }

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
