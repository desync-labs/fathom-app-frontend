import { FC } from "react";
import StreamItem from "components/Staking/StreamItem";
import { Box, Typography } from "@mui/material";

const StakingPositions: FC = () => {
  return (
    <Box>
      <Typography fontSize="20px" fontWeight={600}>
        My Positions
      </Typography>
      <StreamItem token={"FTHM"} />
    </Box>
  );
};

export default StakingPositions;
