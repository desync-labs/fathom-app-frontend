import { FC } from "react";
import { Box, styled, Typography } from "@mui/material";
import MethodListItem from "components/Vault/VaultListItem/AdditionalInfoTabs/Managment/MethodListItem";

export const ContractMethodListWrapper = styled(Box)`
  padding: 0;

  &.hide {
    display: none;
  }
`;

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
  isShow: boolean;
  vaultId: string;
  vaultMethods: AbiItem[];
};

const ManagementContractMethodList: FC<VaultItemManagementProps> = ({
  isShow,
  vaultId,
  vaultMethods,
}) => {
  return (
    <ContractMethodListWrapper className={isShow ? "showing" : "hide"}>
      {!vaultMethods.length ? (
        <Typography>Has no contract methods yet</Typography>
      ) : (
        vaultMethods.map((method: AbiItem, index: number) => (
          <MethodListItem
            key={index}
            method={method}
            contractAddress={vaultId}
          />
        ))
      )}
    </ContractMethodListWrapper>
  );
};

export default ManagementContractMethodList;
