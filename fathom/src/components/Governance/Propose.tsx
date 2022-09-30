import * as React from "react";
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
import { FormGroup, FormControlLabel, Checkbox, Toolbar } from "@mui/material";
import { Constants } from "../../helpers/Constants";
import { useWeb3React } from "@web3-react/core";

import AlertMessages from "../Common/AlertMessages";
import TransactionStatus from "../Transaction/TransactionStatus";

const ProposeListView = observer(() => {
  const proposeStore = useStores().proposalStore;

  const [targets, setTargets] = React.useState("");
  const [calldata, setCallDatas] = React.useState("");
  const [values, setValues] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [description_title, setDescription_title] = React.useState("");
  const [isFirstChecked, setIsFirstChecked] = React.useState(false);

  const { account } = useMetaMask()!;

  const { chainId } = useWeb3React()!;

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
    setDescription_title(e.target.value);
  };

  const handleClickPropose = async () => {
    try {
      if (isFirstChecked && chainId) {
        const vals = values.trim().split(",").map(Number);
        const caldatas = calldata.trim().split(",");
        const tars = targets.trim().split(",");
        const combined_text =
          description_title + "    ----------------    " + description;

        await proposeStore.createProposal(
          tars,
          vals,
          caldatas,
          combined_text,
          account
        );
      } else {
        const combined_text =
          description_title + "    ----------------    " + description;
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
    <Box
      component="main"
      sx={{
        backgroundColor: "#000",
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Toolbar />
      <AlertMessages />
      <TransactionStatus />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
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
                  </div>

                  <div>
                    <TextField
                      id="outlined-textarea"
                      label="Title"
                      multiline
                      rows={1}
                      value={description_title}
                      onChange={handleDescriptionTitleChange}
                    />
                  </div>

                  <div>
                    <TextField
                      id="outlined-textarea"
                      label="Description"
                      multiline
                      rows={4}
                      value={description}
                      onChange={handleDescriptionChange}
                    />
                  </div>

                  <div>
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
      </Container>
    </Box>
  );
});

export default ProposeListView;

// import { useState } from "react";
// import {
//   Container,
//   Box,
//   TextField,
//   Button,
//   Paper,
//   Toolbar,
//   Typography,
// } from "@mui/material";
// import { useStores } from "../../stores";
// import { observer } from "mobx-react";
// import useMetaMask from "../../hooks/metamask";
// import { useCallback } from "react";
// import AlertMessages from "../Common/AlertMessages";
// import TransactionStatus from "../Transaction/TransactionStatus";
// import * as React from "react";

// const MakePropose = observer(() => {
//   const proposeStore = useStores().proposalStore;
//   const [targets, setTargets] = useState("");
//   const [calldata, setCallDatas] = useState("");
//   const [values, setValues] = useState("");
//   const [description, setDescription] = useState("");
//   const { account } = useMetaMask()!;

//   const handleTargetsChange = (e: any) => {
//     setTargets(e.target.value);
//   };

//   const handleCalldataChange = (e: any) => {
//     setCallDatas(e.target.value);
//   };

//   const handleValuesChange = (e: any) => {
//     setValues(e.target.value);
//   };

//   const handleDescriptionChange = (e: any) => {
//     setDescription(e.target.value);
//   };

//   const handleClickPropose = useCallback(async () => {
//     try {
//       const vals = values.trim().split(",").map(Number);
//       const calldatas = calldata.trim().split(",");
//       const tars = targets.trim().split(",");
//       await proposeStore.createProposal(
//         tars,
//         vals,
//         calldatas,
//         description,
//         account
//       );
//     } catch (err) {
//       console.log(err);
//     }
//   }, [account, description, values, calldata, targets, proposeStore]);

//   return (
//     <Box
//       component="main"
//       sx={{
//         backgroundColor: "#000",
//         flexGrow: 1,
//         height: "100vh",
//         overflow: "auto",
//       }}
//     >
//       <Toolbar />
//       <AlertMessages />
//       <TransactionStatus />
//       <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//         <Paper
//           sx={{
//             p: 2,
//             display: "flex",
//             flexDirection: "column",
//             height: 490,
//           }}
//         >
//           <Typography component="h2" variant="h6" color="primary" gutterBottom>
//             Create Proposal
//           </Typography>
//           <Box
//             component="form"
//             sx={{
//               "& .MuiTextField-root": { m: 1, width: "95%" },
//             }}
//             noValidate
//             autoComplete="off"
//           >
//             <div>
//               <TextField
//                 id="outlined-multiline-flexible"
//                 label="Target addresses array"
//                 multiline
//                 value={targets}
//                 maxRows={1}
//                 onChange={handleTargetsChange}
//               />
//             </div>
//             <div>
//               <TextField
//                 id="outlined-textarea2"
//                 label="Values array"
//                 multiline
//                 value={values}
//                 maxRows={1}
//                 onChange={handleValuesChange}
//               />
//             </div>
//             <div>
//               <TextField
//                 id="outlined-multiline-static"
//                 label="Calldatas array"
//                 multiline
//                 value={calldata}
//                 maxRows={1}
//                 onChange={handleCalldataChange}
//               />
//             </div>
//             <div>
//               <TextField
//                 id="outlined-textarea"
//                 label="Description"
//                 multiline
//                 rows={4}
//                 value={description}
//                 onChange={handleDescriptionChange}
//               />
//             </div>
//             <div>
//               <Button variant="outlined" onClick={handleClickPropose}>
//                 Create Proposal
//               </Button>
//             </div>
//           </Box>
//         </Paper>
//       </Container>
//     </Box>
//   );
// });

// export default MakePropose;
