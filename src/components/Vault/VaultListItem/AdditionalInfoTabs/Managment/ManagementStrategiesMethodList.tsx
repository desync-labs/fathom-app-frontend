import { FC, memo, useState } from "react";
import { Box, MenuItem, Typography } from "@mui/material";
import MethodListItem from "components/Vault/VaultListItem/AdditionalInfoTabs/Managment/MethodListItem";
import { AppSelect } from "components/AppComponents/AppForm/AppForm";
import { SelectChangeEvent } from "@mui/material/Select";
import { FilterLabel } from "components/Vault/VaultFilters";
import { strategyTitle } from "utils/getStrategyTitleAndDescription";
import { formatHashShorten } from "utils/format";
import { FunctionFragment } from "@into-the-fathom/abi";

type ManagementStrategiesMethodListProps = {
  strategiesIds: string[];
  strategyMethods: FunctionFragment[];
};

const ManagementStrategiesMethodList: FC<
  ManagementStrategiesMethodListProps
> = ({ strategiesIds, strategyMethods }) => {
  const [currentStrategyId, setCurrentStrategyId] = useState<string>("");

  return (
    <>
      {strategiesIds?.length && (
        <Box my={2}>
          <FilterLabel>Strategy</FilterLabel>
          <AppSelect
            value={currentStrategyId}
            onChange={(event: SelectChangeEvent<unknown>) => {
              setCurrentStrategyId(event.target.value as string);
            }}
          >
            {strategiesIds.map((id, index) => (
              <MenuItem key={id} value={id}>
                {strategyTitle[id.toLowerCase()] ? (
                  strategyTitle[id.toLowerCase()]
                ) : (
                  <>FXD: Direct Incentive - Educational Strategy {index + 1}</>
                )}{" "}
                {`(${formatHashShorten(id)})`}
              </MenuItem>
            ))}
          </AppSelect>
        </Box>
      )}
      {!strategyMethods.length ? (
        <Typography>Has no contract methods yet</Typography>
      ) : (
        strategyMethods.map((method: FunctionFragment, index: number) => (
          <MethodListItem
            key={index}
            method={method}
            contractAddress={currentStrategyId}
          />
        ))
      )}
    </>
  );
};

export default memo(ManagementStrategiesMethodList);
