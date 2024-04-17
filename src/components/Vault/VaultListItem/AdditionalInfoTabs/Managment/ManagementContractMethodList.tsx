import { SmartContractFactory } from "fathom-sdk";
import { FC, useCallback, useEffect, useState } from "react";
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
};

const ABI = SmartContractFactory.FathomVault("").abi;

const ManagementContractMethodList: FC<VaultItemManagementProps> = ({
  vaultId,
}) => {
  const [contractMethods, setContractMethods] = useState<AbiItem[]>([]);

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
    extractContractMethods(ABI as AbiItem[]);
  }, [extractContractMethods]);

  return (
    <>
      {!contractMethods.length ? (
        <Typography>Has no contract methods yet</Typography>
      ) : (
        contractMethods.map((method: AbiItem, index: number) => (
          <MethodListItem key={index} method={method} vaultId={vaultId} />
        ))
      )}
    </>
  );
};

export default ManagementContractMethodList;
