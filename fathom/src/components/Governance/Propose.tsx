import { useCallback } from "react";
import {
  Box,
  TextField,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import { useStores } from "../../stores";
import { observer } from "mobx-react";
import useMetaMask from "../../hooks/metamask";
import { Constants } from "../../helpers/Constants";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { AppPaper } from "../AppPaper/AppPaper";

const ProposeListView = observer(() => {
  const proposeStore = useStores().proposalStore;
  const { account, chainId } = useMetaMask()!;

  const { handleSubmit, watch, control, reset } = useForm({
    defaultValues: {
      withAction: false,
      descriptionTitle: "",
      description: "",
      inputValues: "",
      calldata: "",
      targets: "",
    },
  });

  const withAction = watch("withAction");

  useEffect(() => {
    if (chainId) {
      setTimeout(() => {
        proposeStore.getVeBalance(account, chainId);
      });
    }
  }, [account, chainId, proposeStore]);

  const onSubmit = useCallback(
    async (values: Record<string, any>) => {
      try {
        if (!chainId) return;

        const {
          descriptionTitle,
          description,
          inputValues,
          calldata,
          targets,
          withAction,
        } = values;
        const combinedText =
          descriptionTitle + "    ----------------    " + description;

        if (withAction) {
          const valuesArray = inputValues.trim().split(",").map(Number);
          const calldataArray = calldata.trim().split(",");
          const targetsArray = targets.trim().split(",");

          await proposeStore.createProposal(
            targetsArray,
            valuesArray,
            calldataArray,
            combinedText,
            account
          );
        } else {
          await proposeStore.createProposal(
            [Constants.ZERO_ADDRESS],
            [0],
            [Constants.ZERO_ADDRESS],
            combinedText,
            account
          );
        }
        reset();
      } catch (err) {
        console.log(err);
      }
    },
    [reset, account, chainId, proposeStore]
  );

  return (
    <>
      <AppPaper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Create Proposal
        </Typography>
        <Typography gutterBottom>
          Your ve token balance is:{" "}
          {(proposeStore.veBalance / 10 ** 18).toFixed(2)} veFTHM
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            "& .MuiTextField-root": { my: 1, width: "95%" },
          }}
          noValidate
          autoComplete="off"
        >
          <FormGroup>
            <Controller
              control={control}
              name="withAction"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FormControlLabel
                  control={<Checkbox onChange={onChange} checked={!!value} />}
                  label="Create proposal with action"
                />
              )}
            />
          </FormGroup>

          <Controller
            control={control}
            name="descriptionTitle"
            rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                error={!!error}
                id="outlined-textarea"
                label="Title"
                multiline
                rows={1}
                value={value}
                onChange={onChange}
                helperText={error ? "Field Title is required" : ""}
              />
            )}
          />
          <Controller
            control={control}
            name="description"
            rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                error={!!error}
                id="outlined-textarea"
                label="Description"
                multiline
                rows={4}
                value={value}
                onChange={onChange}
                helperText={error ? "Field Description is required" : ""}
              />
            )}
          />
          {withAction ? (
            <>
              <Controller
                control={control}
                name="targets"
                rules={{ required: true }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    error={!!error}
                    id="outlined-multiline-flexible"
                    label="Target address array"
                    multiline
                    value={value}
                    maxRows={1}
                    helperText={error ? "Field Target address array is required" : ""}
                    onChange={onChange}
                  />
                )}
              />

              <Controller
                control={control}
                name="inputValues"
                rules={{ required: true }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    error={!!error}
                    id="outlined-textarea2"
                    label="Values array"
                    multiline
                    value={value}
                    maxRows={1}
                    helperText={error ? "Field Values array is required" : ""}
                    onChange={onChange}
                  />
                )}
              />

              <Controller
                control={control}
                name="calldata"
                rules={{ required: true }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    error={!!error}
                    id="outlined-multiline-static"
                    label="Calldata array"
                    multiline
                    value={value}
                    maxRows={1}
                    helperText={error ? "Field Calldata array is required" : ""}
                    onChange={onChange}
                  />
                )}
              />
            </>
          ) : (
            ""
          )}
          {proposeStore.veBalance / 10 ** 18 < 1000 ? (
            <>
              <Button
                variant="outlined"
                type="submit"
                disabled={true}
                sx={{ my: 4 }}
              >
                Create Proposal
              </Button>
              <Box component="span" sx={{ display: "inline-block", mx: 2 }}>
                A balance of at least 1000 veFTHM is required to create a
                proposal.
              </Box>
            </>
          ) : (
            <>
              <Button variant="outlined" type="submit" sx={{ my: 3 }}>
                Create Proposal
              </Button>
            </>
          )}
        </Box>
      </AppPaper>
    </>
  );
});

export default ProposeListView;
