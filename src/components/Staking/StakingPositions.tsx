import { TitleSecondary } from "components/AppComponents/AppBox/AppBox";
import { FC } from "react";
import StreamItem from "components/Staking/StreamItem";
import { Box } from "@mui/material";

const StakingPositions: FC = () => {
  return (
    <Box mt={3}>
      <TitleSecondary>My Positions</TitleSecondary>
      <StreamItem token={"FTHM"} />
    </Box>
  );
};

export default StakingPositions;
