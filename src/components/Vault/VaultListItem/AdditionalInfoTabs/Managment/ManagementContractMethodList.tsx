import { FC } from "react";
import { Typography } from "@mui/material";
import MethodListItem from "components/Vault/VaultListItem/AdditionalInfoTabs/Managment/MethodListItem";

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
  vaultMethods: AbiItem[];
};

const ManagementContractMethodList: FC<VaultItemManagementProps> = ({
  vaultId,
  vaultMethods,
}) => {
  return (
    <>
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
    </>
  );
};

export default ManagementContractMethodList;
