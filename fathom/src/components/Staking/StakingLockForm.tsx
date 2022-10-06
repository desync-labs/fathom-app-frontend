import { Box, Button, Slider, TextField } from "@mui/material";
import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { FC, useCallback } from "react";
import useMetaMask from "../../hooks/metamask";
import { useStores } from "../../stores";

type StakingLockFormPropsType = {
  fetchAll: (account: string, chainId: number) => Promise<void>;
};

const StakingLockForm: FC<StakingLockFormPropsType> = ({ fetchAll }) => {
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

  const onSubmit = useCallback(
    async (values: Record<string, any>) => {
      const { stakePosition, lockDays } = values;

      await stakingStore.createLock(account, stakePosition, lockDays, chainId);

      reset();
      fetchAll(account, chainId);
    },
    [stakingStore, account, chainId, fetchAll, reset]
  );

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

      <Button sx={{ m: 3, mr: 10 }} variant="outlined" type="submit">
        Create Lock
      </Button>
    </form>
  );
};

export default StakingLockForm;
