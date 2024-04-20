import { FC, useState, SyntheticEvent, useMemo, memo, ReactNode } from "react";
import { Box, styled, Tab, Tabs, Typography } from "@mui/material";
import { FunctionFragment } from "@into-the-fathom/abi";
import MethodListItem from "components/Vault/VaultListItem/AdditionalInfoTabs/Managment/MethodListItem";

export const ContractMethodListWrapper = styled(Box)`
  padding: 0;

  &.hide {
    display: none;
  }
`;

export const STATE_MUTABILITY_TRANSACTIONS = ["nonpayable", "payable"];

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

export const MethodsTabPanel: FC<TabPanelProps> = memo(
  ({ children, value, index, ...other }) => {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`method-tabpanel-${index}`}
        aria-labelledby={`method-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }
);

export const a11yProps = (index: number) => {
  return {
    id: `method-tab-${index}`,
    "aria-controls": `method-tabpanel-${index}`,
  };
};

type VaultItemManagementProps = {
  isShow: boolean;
  vaultId: string;
  vaultMethods: FunctionFragment[];
};

const ManagementVaultMethodList: FC<VaultItemManagementProps> = ({
  isShow,
  vaultId,
  vaultMethods,
}) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <ContractMethodListWrapper className={isShow ? "showing" : "hide"}>
      {!vaultMethods.length ? (
        <Typography>Has no contract methods yet</Typography>
      ) : (
        <>
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
                vaultMethods
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
                      contractAddress={vaultId}
                    />
                  )),
              [vaultMethods]
            )}
          </MethodsTabPanel>
          <MethodsTabPanel value={value} index={1}>
            {useMemo(
              () =>
                vaultMethods
                  .filter((method) =>
                    STATE_MUTABILITY_TRANSACTIONS.includes(
                      method.stateMutability
                    )
                  )
                  .map((method: FunctionFragment, index: number) => (
                    <MethodListItem
                      key={index}
                      method={method}
                      contractAddress={vaultId}
                    />
                  )),
              [vaultMethods]
            )}
          </MethodsTabPanel>
        </>
      )}
    </ContractMethodListWrapper>
  );
};

export default memo(ManagementVaultMethodList);
