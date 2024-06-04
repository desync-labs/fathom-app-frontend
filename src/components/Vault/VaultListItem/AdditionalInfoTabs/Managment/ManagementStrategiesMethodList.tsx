import { FC, memo, SyntheticEvent, useMemo, useState } from "react";
import { Box, MenuItem, styled, Tab, Tabs, Typography } from "@mui/material";
import MethodListItem from "components/Vault/VaultListItem/AdditionalInfoTabs/Managment/MethodListItem";
import { AppSelect } from "components/AppComponents/AppForm/AppForm";
import { SelectChangeEvent } from "@mui/material/Select";
import { FilterLabel } from "components/Vault/VaultFilters";
import { strategyTitle } from "utils/getStrategyTitleAndDescription";
import { formatHashShorten } from "utils/format";
import { FunctionFragment } from "@into-the-fathom/abi";
import {
  a11yProps,
  ContractMethodListWrapper,
  MethodsTabPanel,
  STATE_MUTABILITY_TRANSACTIONS,
} from "components/Vault/VaultListItem/AdditionalInfoTabs/Managment/ManagementVaultMethodList";

type ManagementStrategiesMethodListProps = {
  isShow: boolean;
  strategiesIds: string[];
  strategyMethods: FunctionFragment[];
};

const ManagementStrategiesMethodTabsStyled = styled(Box)`
  margin-top: 20px;
`;

const ManagementStrategiesMethodTabs: FC<{
  strategyMethods: FunctionFragment[];
  currentStrategyId: string;
}> = memo(({ strategyMethods, currentStrategyId }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return !strategyMethods.length ? (
    <Typography>Has no contract methods yet</Typography>
  ) : (
    <ManagementStrategiesMethodTabsStyled>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="state mutability tabs"
      >
        <Tab label="Read" {...a11yProps(0)} />
        <Tab label="Write" {...a11yProps(1)} />
      </Tabs>
      <MethodsTabPanel value={value} index={0}>
        {useMemo(
          () =>
            strategyMethods
              .filter(
                (method) =>
                  !STATE_MUTABILITY_TRANSACTIONS.includes(
                    method.stateMutability
                  )
              )
              .map((method: FunctionFragment, index: number) => (
                <MethodListItem
                  key={index}
                  method={method}
                  contractAddress={currentStrategyId}
                />
              )),
          [strategyMethods]
        )}
      </MethodsTabPanel>
      <MethodsTabPanel value={value} index={1}>
        {useMemo(
          () =>
            strategyMethods
              .filter((method) =>
                STATE_MUTABILITY_TRANSACTIONS.includes(method.stateMutability)
              )
              .map((method: FunctionFragment, index: number) => (
                <MethodListItem
                  key={index}
                  method={method}
                  contractAddress={currentStrategyId}
                />
              )),
          [strategyMethods]
        )}
      </MethodsTabPanel>
    </ManagementStrategiesMethodTabsStyled>
  );
});

const ManagementStrategiesMethodList: FC<
  ManagementStrategiesMethodListProps
> = ({ isShow, strategiesIds, strategyMethods }) => {
  const [currentStrategyId, setCurrentStrategyId] = useState<string>(
    strategiesIds[0]
  );

  return (
    <ContractMethodListWrapper className={isShow ? "showing" : "hide"}>
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
          <ManagementStrategiesMethodTabs
            strategyMethods={strategyMethods}
            currentStrategyId={currentStrategyId}
          />
        </Box>
      )}
    </ContractMethodListWrapper>
  );
};

export default memo(ManagementStrategiesMethodList);
