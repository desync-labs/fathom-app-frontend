import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useStores } from "../../stores";
import { observer } from "mobx-react";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { Constants } from "../../helpers/Constants";
import { useCallback } from "react";
import useMetaMask from "../../hooks/metamask";

const MakeProposal = observer(() => {
  const proposeStore = useStores().proposalStore;

  const [targets, setTargets] = useState<string>("");
  const [calldata, setCallDatas] = useState<string>("");
  const [values, setValues] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [descriptionTitle, setDescriptionTitle] = useState<string>("");
  const [isFirstChecked, setIsFirstChecked] = useState<boolean>(false);
  const { chainId, account } = useMetaMask()!;

  const handleTargetsChange = useCallback(
    (e: any) => {
      setTargets(e.target.value);
    },
    [setTargets]
  );

  const handleCallDataChange = useCallback(
    (e: any) => {
      setCallDatas(e.target.value);
    },
    [setCallDatas]
  );

  const handleValuesChange = useCallback(
    (e: any) => {
      setValues(e.target.value);
    },
    [setValues]
  );

  const handleDescriptionChange = useCallback(
    (e: any) => {
      setDescription(e.target.value);
    },
    [setDescription]
  );

  const handleDescriptionTitleChange = (e: any) => {
    setDescriptionTitle(e.target.value);
  };

  const handleClickPropose = async () => {
    try {
      if (isFirstChecked && chainId) {
        const vals = values.trim().split(",").map(Number);
        const caldatas = calldata.trim().split(",");
        const tars = targets.trim().split(",");
        const combined_text =
          descriptionTitle + "    ----------------    " + description;

        await proposeStore.createProposal(
          tars,
          vals,
          caldatas,
          combined_text,
          account
        );
      } else {
        const combined_text =
          descriptionTitle + "    ----------------    " + description;
        if (chainId) {
          await proposeStore.createProposal(
            [Constants.ZERO_ADDRESS],
            [0],
            [Constants.ZERO_ADDRESS],
            combined_text,
            account
          );
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={8} md={8} lg={9}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 590,
          }}
        >
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Create Proposal
          </Typography>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "95%" },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={() => setIsFirstChecked(!isFirstChecked)}
                    />
                  }
                  label="Create proposal with action"
                />
              </FormGroup>

              <TextField
                id="outlined-textarea"
                label="Title"
                multiline
                rows={1}
                value={descriptionTitle}
                onChange={handleDescriptionTitleChange}
              />

              <TextField
                id="outlined-textarea"
                label="Description"
                multiline
                rows={4}
                value={description}
                onChange={handleDescriptionChange}
              />

              {isFirstChecked ? (
                <>
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Target addresses array"
                    multiline
                    value={targets}
                    maxRows={1}
                    onChange={handleTargetsChange}
                  />

                  <TextField
                    id="outlined-textarea2"
                    label="Values array"
                    multiline
                    value={values}
                    maxRows={1}
                    onChange={handleValuesChange}
                  />

                  <TextField
                    id="outlined-multiline-static"
                    label="Calldatas array"
                    multiline
                    value={calldata}
                    maxRows={1}
                    onChange={handleCallDataChange}
                  />
                </>
              ) : null}
            </div>

            <div>
              <Button variant="outlined" onClick={handleClickPropose}>
                Create Proposal
              </Button>
            </div>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
});

export default MakeProposal;
