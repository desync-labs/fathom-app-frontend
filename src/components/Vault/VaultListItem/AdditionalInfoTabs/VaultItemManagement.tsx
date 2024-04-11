import { IVault, SmartContractFactory } from "fathom-sdk";
import { FC, useCallback, useEffect, useState } from "react";
import { Typography } from "@mui/material";
import VaultManagementItem from "./VaultManagementItem";

const STATE_MUTABILITY_TRANSACTIONS = ["nonpayable", "payable"];

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

const VaultItemManagement: FC<VaultItemManagementProps> = ({ vaultId }) => {
  const [contractMethods, setContractMethods] = useState<AbiItem[]>([]);
  const vaultAbi = SmartContractFactory.FathomVault("").abi;

  const extractContractMethods = useCallback(
    (abi: string) => {
      try {
        const abiJson = JSON.parse(abi);
        const methods = abiJson.filter(
          (item: AbiItem) =>
            item.type === "function" &&
            STATE_MUTABILITY_TRANSACTIONS.includes(item.stateMutability)
        );

        setContractMethods(methods);
      } catch (e: any) {
        console.error(e);
      }
    },
    [setContractMethods]
  );

  useEffect(() => {
    extractContractMethods(JSON.stringify(vaultAbi));
  }, [vaultAbi, extractContractMethods]);

  useEffect(() => {
    console.log("VaultId: ", vaultId);
    console.log("Abi: ", vaultAbi);
    console.log("Methods: ", contractMethods);
  }, [contractMethods]);

  return (
    <>
      {!contractMethods.length ? (
        <Typography>Has no strategies yet</Typography>
      ) : (
        contractMethods.map((method: AbiItem, index: number) => (
          <VaultManagementItem key={index} method={method} />
        ))
      )}
    </>
  );
};

export default VaultItemManagement;
