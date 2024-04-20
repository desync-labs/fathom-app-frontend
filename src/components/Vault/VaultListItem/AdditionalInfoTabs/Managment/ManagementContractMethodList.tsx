import { FC } from "react";
import { Typography } from "@mui/material";
import MethodListItem from "components/Vault/VaultListItem/AdditionalInfoTabs/Managment/MethodListItem";
import { FunctionFragment } from "@into-the-fathom/abi";

export const STATE_MUTABILITY_TRANSACTIONS = ["nonpayable", "payable"];

type VaultItemManagementProps = {
  vaultId: string;
  vaultMethods: FunctionFragment[];
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
        vaultMethods.map((method: FunctionFragment, index: number) => (
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
