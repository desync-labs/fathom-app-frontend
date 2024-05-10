import { FC, memo, SyntheticEvent, useMemo, useState } from "react";
import { Box, MenuItem, styled, Tab, Typography } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { FunctionFragment } from "@into-the-fathom/abi";

import { strategyTitle } from "utils/getStrategyTitleAndDescription";
import { formatHashShorten } from "utils/format";
import { AppSelect } from "components/AppComponents/AppForm/AppForm";
import {
  a11yProps,
  ContractMethodListWrapper,
  MethodsTabPanel,
  MethodTypesTabs,
  STATE_MUTABILITY_TRANSACTIONS,
} from "components/Vaults/VaultDetail/Managment/ManagementVaultMethodList";
import MethodListItem from "components/Vaults/VaultDetail/Managment/MethodListItem";
import StrategyStatusBar from "./StrategyStatusBar";

const StrategyManagerDescription = styled("div")`
  color: #fff;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0.14px;
  padding-top: 20px;
  padding-bottom: 48px;

  & a {
    color: #43fff1;
    text-decoration-line: underline;
  }
`;

export const StrategySelectLabel = styled("div")`
  font-size: 11px;
  font-weight: 600;
  line-height: 16px;
  color: #b7c8e5;
  text-transform: uppercase;
  padding-bottom: 5px;
`;

const StrategySelect = styled(AppSelect)`
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 0;
  overflow: hidden;

  & .MuiOutlinedInput-input {
    color: #566e99;
    border-radius: 8px;
    border: 1px solid #2c4066;
    background: #1e2f4d;
  }

  & .MuiSelect-icon {
    color: #6d86b2;
  }
`;

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
      <MethodTypesTabs
        value={value}
        onChange={handleChange}
        aria-label="state mutability tabs"
      >
        <Tab label="Read Contract" {...a11yProps(0)} />
        <Tab label="Write Contract" {...a11yProps(1)} />
      </MethodTypesTabs>
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
                  index={index}
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
                  index={index}
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
  const [currentStrategyName, setCurrentStrategyName] = useState<string>(
    strategyTitle[strategiesIds[0].toLowerCase()] ||
      `FXD: Direct Incentive - Educational Strategy 1`
  );

  const handleStrategyChange = (event: SelectChangeEvent<unknown>) => {
    const { value } = event.target as HTMLInputElement;
    setCurrentStrategyId(value as string);

    const index = strategiesIds.findIndex((id) => id === value);
    setCurrentStrategyName(
      strategyTitle[value.toLowerCase()] ||
        `FXD: Direct Incentive - Educational Strategy ${index + 1}`
    );
  };

  return (
    <ContractMethodListWrapper className={isShow ? "showing" : "hide"}>
      {strategiesIds?.length && (
        <Box my={2}>
          <StrategyManagerDescription>
            The strategy manager for a vault is responsible for overseeing and
            managing various investment strategies within the vault. This
            includes monitoring performance, adjusting parameters, and ensuring
            optimal execution of the strategies to achieve the desired financial
            outcomes. <a href="#">Learn More</a>
          </StrategyManagerDescription>
          <StrategySelectLabel>Select Strategy</StrategySelectLabel>
          <StrategySelect
            value={currentStrategyId}
            onChange={handleStrategyChange}
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
          </StrategySelect>
          <StrategyStatusBar
            strategyId={currentStrategyId}
            strategyName={currentStrategyName}
          />
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
