import { FC, useState, SyntheticEvent, useMemo, memo, ReactNode } from "react";
import { Box, styled, Tab, Tabs, Typography } from "@mui/material";
import { FunctionFragment } from "@into-the-fathom/abi";
import MethodListItem, {
  ReadeMethodIcon,
  WriteMethodIcon,
} from "components/Vaults/VaultDetail/Managment/MethodListItem";
import { Contract } from "@into-the-fathom/contracts";
import useConnector from "context/connector";
import { AppFlexBox } from "components/AppComponents/AppBox/AppBox";

export const ContractMethodListWrapper = styled(Box)`
  padding: 0;

  &.hide {
    display: none;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 24px 0 0;
  }
`;

export const MethodTypesTabs = styled(Tabs)`
  width: fit-content;
  border-bottom: 1.5px solid #1d2d49;
  min-height: unset;
  margin-top: 44px;

  & .MuiTabs-indicator {
    height: 1px;
  }

  & .MuiTab-root {
    min-height: unset;
    min-width: unset;
    color: #9fadc6;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    padding: 8px 16px;

    &.Mui-selected {
      color: #fff;
    }
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    margin-top: 0;

    & .MuiTab-root {
      width: 50%;
    }
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
        {value === index && <Box sx={{ pt: "24px" }}>{children}</Box>}
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

  const { account, library } = useConnector();

  const readContract = useMemo(() => {
    return new Contract(vaultId, vaultMethods, library);
  }, [vaultMethods, vaultId, library]);

  const writeContract = useMemo(() => {
    return new Contract(vaultId, vaultMethods, library.getSigner(account));
  }, [vaultMethods, vaultId, account, library]);

  return (
    <ContractMethodListWrapper className={isShow ? "showing" : "hide"}>
      {!vaultMethods.length ? (
        <Typography>Has no contract methods yet</Typography>
      ) : (
        <>
          <MethodTypesTabs
            value={value}
            onChange={handleChange}
            aria-label="state mutability tabs"
          >
            <Tab label="Read Contract" {...a11yProps(0)} />
            <Tab label="Write Contract" {...a11yProps(1)} />
          </MethodTypesTabs>
          <AppFlexBox
            sx={{
              justifyContent: "flex-start",
              justifyItems: "center",
              mt: "30px",
            }}
          >
            {value === 0 ? (
              <ReadeMethodIcon color={"#6D86B2"} />
            ) : (
              <WriteMethodIcon color={"#6D86B2"} />
            )}
            <Typography sx={{ color: "#fff", fontSize: "14px" }}>
              {value === 0
                ? "Read contract information"
                : "Write contract information"}
            </Typography>
          </AppFlexBox>
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
                      index={index}
                      readContract={readContract}
                      writeContract={writeContract}
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
                      index={index}
                      readContract={readContract}
                      writeContract={writeContract}
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
