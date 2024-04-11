import { SmartContractFactory } from "fathom-sdk";
import { FC, useCallback, useEffect, useState } from "react";
import { Typography } from "@mui/material";
import VaultManagementItem from "components/Vault/VaultListItem/AdditionalInfoTabs/Managment/VaultManagementItem";

export const STATE_MUTABILITY_TRANSACTIONS = ["nonpayable", "payable"];
export const STATE_MUTABILITY_VIEW = ["view", "pure"];

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

const VaultItemManagement: FC<VaultItemManagementProps> = ({ vaultId }) => {
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

  useEffect(() => {
    console.log("VaultId: ", vaultId);
    console.log("Abi: ", ABI);
    console.log("Methods: ", contractMethods);
  }, [contractMethods]);

  return (
    <>
      {!contractMethods.length ? (
        <Typography>Has no strategies yet</Typography>
      ) : (
        contractMethods.map((method: AbiItem, index: number) => (
          <VaultManagementItem key={index} method={method} vaultId={vaultId} />
        ))
      )}
    </>
  );
};

export default VaultItemManagement;
