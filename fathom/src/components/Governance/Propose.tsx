import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import { useStores } from "../../stores";
import { observer } from "mobx-react";
import useMetaMask from "../../hooks/metamask";
import { useCallback } from "react";
import * as React from "react";

const MakePropose = observer(() => {
  const proposeStore = useStores().proposalStore;
  const [targets, setTargets] = useState("");
  const [calldata, setCallDatas] = useState("");
  const [values, setValues] = useState("");
  const [description, setDescription] = useState("");
  const { account } = useMetaMask()!;

  const handleTargetsChange = (e: any) => {
    setTargets(e.target.value);
  };

  const handleCallDataChange = (e: any) => {
    setCallDatas(e.target.value);
  };

  const handleValuesChange = (e: any) => {
    setValues(e.target.value);
  };

  const handleDescriptionChange = (e: any) => {
    setDescription(e.target.value);
  };

  const handleClickPropose = useCallback(async () => {
    try {
      const vals = values.trim().split(",").map(Number);
      const calldatas = calldata.trim().split(",");
      const tars = targets.trim().split(",");
      await proposeStore.createProposal(
        tars,
        vals,
        calldatas,
        description,
        account
      );
    } catch (err) {
      console.log(err);
    }
  }, [account, description, values, calldata, targets, proposeStore]);

  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        height: 490,
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
          <TextField
            id="outlined-multiline-flexible"
            label="Target addresses array"
            multiline
            value={targets}
            maxRows={1}
            onChange={handleTargetsChange}
          />
        </div>
        <div>
          <TextField
            id="outlined-textarea2"
            label="Values array"
            multiline
            value={values}
            maxRows={1}
            onChange={handleValuesChange}
          />
        </div>
        <div>
          <TextField
            id="outlined-multiline-static"
            label="Calldatas array"
            multiline
            value={calldata}
            maxRows={1}
            onChange={handleCallDataChange}
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
          <Button variant="outlined" onClick={handleClickPropose}>
            Create Proposal
          </Button>
        </div>
      </Box>
    </Paper>
  );
});

export default MakePropose;
