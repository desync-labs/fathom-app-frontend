import { FC, memo } from "react";
import { Typography } from "@mui/material";
import { IVault } from "fathom-sdk";
import VaultStrategyItem from "components/Vault/VaultListItem/AdditionalInfoTabs/VaultStrategyItem";

type VaultItemStrategiesPropsTypes = {
  vaultItemData: IVault;
  performanceFee: number;
};

const VaultItemStrategies: FC<VaultItemStrategiesPropsTypes> = ({
  vaultItemData,
  performanceFee,
}) => {
  const { strategies, balanceTokens, token } = vaultItemData;
  return (
    <>
      {!strategies.length ? (
        <Typography>Has not strategies yet</Typography>
      ) : (
        strategies.map((strategy: any, index: number) => (
          <VaultStrategyItem
            strategyData={strategy}
            vaultBalanceTokens={balanceTokens}
            tokenName={token.name}
            performanceFee={performanceFee}
            index={index}
            key={strategy.id}
          />
        ))
      )}
    </>
  );
};

export default memo(VaultItemStrategies);
