import { Box, Divider, FormLabel, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Reward } from "apps/lending/helpers/types";

import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";
import { TokenIcon } from "apps/lending/components/primitives/TokenIcon";

export type RewardsSelectProps = {
  rewards: Reward[];
  setSelectedReward: (key: string) => void;
  selectedReward: string;
};

export const RewardsSelect = ({
  rewards,
  selectedReward,
  setSelectedReward,
}: RewardsSelectProps) => {
  return (
    <FormControl sx={{ mb: 1, width: "100%" }}>
      <FormLabel sx={{ mb: 1, color: "text.secondary" }}>
        <>Reward(s) to claim</>
      </FormLabel>

      <Select
        value={selectedReward}
        onChange={(e) => setSelectedReward(e.target.value)}
        sx={{
          width: "100%",
          height: "44px",
          borderRadius: "6px",
          borderColor: "divider",
          outline: "none !important",
          color: "text.primary",
          ".MuiOutlinedInput-input": {
            backgroundColor: "transparent",
          },
          "&:hover .MuiOutlinedInput-notchedOutline, .MuiOutlinedInput-notchedOutline":
            {
              borderColor: "divider",
              outline: "none !important",
              borderWidth: "1px",
            },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "divider",
            borderWidth: "1px",
          },
          ".MuiSelect-icon": { color: "text.primary" },
        }}
        native={false}
        renderValue={(reward) => {
          if (reward === "all") {
            return (
              <Typography color="text.primary">
                <>Claim all rewards</>
              </Typography>
            );
          }
          const selected = rewards.find((r) => r.symbol === reward) as Reward;
          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TokenIcon
                symbol={selected.symbol}
                sx={{ mr: 2, fontSize: "16px" }}
              />
              <Typography color="text.primary">{selected.symbol}</Typography>
            </Box>
          );
        }}
      >
        <MenuItem value={"all"}>
          <Typography variant="subheader1">
            <>Claim all rewards</>
          </Typography>
        </MenuItem>
        <Divider />
        {rewards.map((reward) => (
          <MenuItem value={reward.symbol} key={`reward-token-${reward.symbol}`}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TokenIcon
                symbol={reward.symbol}
                sx={{ fontSize: "24px", mr: 3 }}
              />
              <Typography variant="subheader1" sx={{ mr: 1 }}>
                {reward.symbol}
              </Typography>
              <Typography
                component="span"
                sx={{ display: "inline-flex", alignItems: "center" }}
                variant="caption"
                color="text.muted"
              >
                ~
              </Typography>
              <FormattedNumber
                value={Number(reward.balanceUsd)}
                variant="caption"
                compact
                symbol="USD"
                symbolsColor="text.muted"
                color="text.muted"
              />
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
