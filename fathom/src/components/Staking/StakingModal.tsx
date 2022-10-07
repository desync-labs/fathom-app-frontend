import { observer } from "mobx-react";
import { Typography } from "@mui/material";
import { AppPaper } from "components/AppComponents/AppPaper/AppPaper";

const StakingModal = observer((props: any) => {
  return (
    <AppPaper
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        height: 240,
      }}
    >
      <Typography component="h2" variant="h5" color="primary" gutterBottom>
        {props.apr} % APR
      </Typography>
      <Typography color="text.secondary">Staked Balance</Typography>
      <Typography component="p" variant="h6">
        {props.stakedBalance}
      </Typography>
      <Typography color="text.secondary">Vote Balance</Typography>
      <Typography component="p" variant="h6">
        {props.voteBalance}
      </Typography>
    </AppPaper>
  );
});

export default StakingModal;
