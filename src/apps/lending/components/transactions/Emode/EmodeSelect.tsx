import { FormLabel, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import * as React from "react";
import { EmodeCategory } from "apps/lending/helpers/types";

import { getEmodeMessage } from "apps/lending/components/transactions/Emode/EmodeNaming";
import { FC } from "react";

export type EmodeSelectProps = {
  emodeCategories: Record<number, EmodeCategory>;
  selectedEmode: number | undefined;
  setSelectedEmode: React.Dispatch<
    React.SetStateAction<EmodeCategory | undefined>
  >;
  userEmode: number;
};

export const EmodeSelect: FC<EmodeSelectProps> = ({
  emodeCategories,
  selectedEmode,
  setSelectedEmode,
  userEmode,
}) => {
  return (
    <FormControl sx={{ mb: 1, width: "100%" }}>
      <FormLabel sx={{ mb: 1, color: "text.secondary" }}>
        Asset category
      </FormLabel>

      <Select
        defaultValue={0}
        value={selectedEmode}
        onChange={(e) => {
          setSelectedEmode(emodeCategories[Number(e.target.value)]);
        }}
        className="EmodeSelect"
        data-cy="EmodeSelect"
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
          ".MuiOutlinedInput-notchedOutline, .MuiOutlinedInput-notchedOutline":
            {
              borderColor: "divider",
              outline: "none !important",
              borderWidth: "1px",
            },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "divider",
            borderWidth: "1px",
          },
          "&.EmodeSelect .MuiSelect-icon": { color: "text.primary" },
        }}
        native={false}
        renderValue={(emode) => {
          if (emode !== 0) {
            return (
              <Typography color="text.primary">
                {getEmodeMessage(emodeCategories[emode].label)}
              </Typography>
            );
          } else {
            return <Typography color="text.muted">Select</Typography>;
          }
        }}
      >
        {Object.keys(emodeCategories).map((categoryKey) => {
          if (userEmode !== Number(categoryKey) && Number(categoryKey) !== 0) {
            return (
              <MenuItem
                key={`emode-${emodeCategories[Number(categoryKey)].id}`}
                value={emodeCategories[Number(categoryKey)].id}
              >
                {
                  <Typography color="text.primary">
                    {getEmodeMessage(
                      emodeCategories[Number(categoryKey)].label
                    )}
                  </Typography>
                }
              </MenuItem>
            );
          }
          return null;
        })}
      </Select>
    </FormControl>
  );
};
