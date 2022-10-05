import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useStores } from "../../stores";
import { observer } from "mobx-react";
import useMetaMask from "../../hooks/metamask";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { Constants } from "../../helpers/Constants";
import { useEffect } from "react";

const ProposeListView = observer(() => {
  let proposeStore = useStores().proposalStore;

  const [targets, setTargets] = useState("");
  const [calldata, setCallDatas] = useState("");
  const [values, setValues] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionTitle, setDescriptionTitle] = useState("");
  const [isFirstChecked, setIsFirstChecked] = useState(false);

  const { account, chainId } = useMetaMask()!;

  useEffect(() => {
    if (chainId) {
      setTimeout(() => {
        proposeStore.getVeBalance(account, chainId);
      });
    }
  }, [account, chainId, proposeStore]);

  const handleTargetsChange = (e: any) => {
    setTargets(e.target.value);
  };

  const handleCalldataChange = (e: any) => {
    setCallDatas(e.target.value);
  };

  const handleValuesChange = (e: any) => {
    setValues(e.target.value);
  };

  const handleDescriptionChange = (e: any) => {
    setDescription(e.target.value);
  };

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

  // const handleClickQ = async () => {
  //   try {
  //     if (isFirstChecked && chainId) {
  //       const vals = values.trim().split(",").map(Number);
  //       const caldatas = calldata.trim().split(",");
  //       const tars = targets.trim().split(",");
  //       const combined_text =
  //         descriptionTitle + "    ----------------    " + description;
  //       await proposeStore.queueProposal(
  //         tars,
  //         vals,
  //         caldatas,
  //         combined_text,
  //         account
  //       );
  //     } else {
  //       const combined_text =
  //         descriptionTitle + "    ----------------    " + description;
  //       if (chainId) {
  //         await proposeStore.queueProposal(
  //           [Constants.ZERO_ADDRESS],
  //           [0],
  //           [Constants.ZERO_ADDRESS],
  //           combined_text,
  //           account
  //         );
  //       }
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={8} md={8} lg={9}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                Create Proposal
              </Typography>
              <Typography gutterBottom>
                Your ve token balance is:{" "}
                {(proposeStore.veBalance / 10 ** 18).toFixed(2)} veFTHM
              </Typography>
              <Box
                component="form"
                sx={{
                  "& .MuiTextField-root": { my: 1, width: "95%" },
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
                        onChange={handleCalldataChange}
                      />
                    </>
                  ) : (
                    ""
                  )}
                </div>
                <div>
                  {proposeStore.veBalance / 10 ** 18 < 1000 ? (
                    <>
                      <Button
                        variant="outlined"
                        onClick={handleClickPropose}
                        disabled={true}
                        sx={{ my: 3 }}
                      >
                        Create Proposal
                      </Button>{" "}
                      A balance of at least 1000 veFTHM is required to create a
                      proposal.
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outlined"
                        onClick={handleClickPropose}
                        disabled={false}
                        sx={{ my: 3 }}
                      >
                        Create Proposal
                      </Button>
                    </>
                  )}
                </div>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
});

export default ProposeListView;
