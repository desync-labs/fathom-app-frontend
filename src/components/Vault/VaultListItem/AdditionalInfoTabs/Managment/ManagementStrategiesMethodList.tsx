import { SmartContractFactory } from "fathom-sdk";
import { FC, memo, useCallback, useEffect, useState } from "react";
import { Box, MenuItem, Typography } from "@mui/material";
import MethodListItem from "components/Vault/VaultListItem/AdditionalInfoTabs/Managment/MethodListItem";
import { AppSelect } from "components/AppComponents/AppForm/AppForm";
import { SelectChangeEvent } from "@mui/material/Select";
import { FilterLabel } from "components/Vault/VaultFilters";
import { strategyTitle } from "utils/getStrategyTitleAndDescription";
import { formatHashShorten } from "utils/format";
import { AbiItem } from "./ManagementContractMethodList";

type ManagementStrategiesMethodListProps = {
  strategiesIds: string[];
};

const STRATEGY_ABI = SmartContractFactory.FathomVaultStrategy("").abi;

const ManagementStrategiesMethodList: FC<
  ManagementStrategiesMethodListProps
> = ({ strategiesIds }) => {
  const [contractMethods, setContractMethods] = useState<AbiItem[]>([]);
  const [currentStrategyId, setCurrentStrategyId] = useState<string>("");

  const extractContractMethods = useCallback(
    (abiJson: AbiItem[]) => {
      try {
        const methods = abiJson.filter(
          (item: AbiItem) =>
            item.type === "function" && item.name.toUpperCase() !== item.name
        );

        setContractMethods(methods);
      } catch (e: any) {
        console.error(e);
      }
    },
    [setContractMethods]
  );

  useEffect(() => {
    extractContractMethods(STRATEGY_ABI as AbiItem[]);
    setCurrentStrategyId(strategiesIds[0]);
  }, [strategiesIds]);

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
      {!contractMethods.length ? (
        <Typography>Has no contract methods yet</Typography>
      ) : (
        contractMethods.map((method: AbiItem, index: number) => (
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
