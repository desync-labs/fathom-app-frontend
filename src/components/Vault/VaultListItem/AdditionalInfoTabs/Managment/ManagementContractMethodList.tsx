import { SmartContractFactory } from "fathom-sdk";
import { FC, useCallback, useEffect, useState } from "react";
import { Box, MenuItem, Typography } from "@mui/material";
import MethodListItem from "components/Vault/VaultListItem/AdditionalInfoTabs/Managment/MethodListItem";
import { AppSelect } from "../../../../AppComponents/AppForm/AppForm";
import { SelectChangeEvent } from "@mui/material/Select";
import { FilterLabel } from "../../../VaultFilters";
import { strategyTitle } from "../../../../../utils/getStrategyTitleAndDescription";
import { formatHashShorten } from "../../../../../utils/format";

export const STATE_MUTABILITY_TRANSACTIONS = ["nonpayable", "payable"];

type AbiInputOutputType = {
  name: string;
  type: string;
};
export interface AbiItem {
  name: string;
  type: string;
  inputs: AbiInputOutputType[];
  outputs: AbiInputOutputType[];
  stateMutability: string;
}

type VaultItemManagementProps = {
  vaultId: string;
  strategiesIds?: string[];
};

const VAULT_ABI = SmartContractFactory.FathomVault("").abi;
const STRATEGY_ABI = SmartContractFactory.FathomVaultStrategy("").abi;

const ManagementContractMethodList: FC<VaultItemManagementProps> = ({
  vaultId,
  strategiesIds,
}) => {
  const [contractMethods, setContractMethods] = useState<AbiItem[]>([]);
  const [currentStrategyId, setCurrentStrategyId] = useState<string | null>(
    null
  );

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
    if (strategiesIds) {
      extractContractMethods(STRATEGY_ABI as AbiItem[]);
    } else {
      extractContractMethods(VAULT_ABI as AbiItem[]);
    }
  }, [extractContractMethods]);

  useEffect(() => {
    console.log({ strategiesIds });
    if (strategiesIds) {
      setCurrentStrategyId(strategiesIds[0]);
    }
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
              <MenuItem value={id}>
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
            contractAddress={currentStrategyId ? currentStrategyId : vaultId}
          />
        ))
      )}
    </>
  );
};

export default ManagementContractMethodList;
