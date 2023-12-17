import { FC } from "react";
import { Typography } from "@mui/material";
import { IVault } from "fathom-sdk";
import VaultStrategyItem from "components/Vault/VaultListItem/AdditionalInfoTabs/VaultStrategyItem";

type VaultItemStrategiesPropsTypes = {
  vaultItemData: IVault;
};

const VaultItemStrategies: FC<VaultItemStrategiesPropsTypes> = ({
  vaultItemData,
}) => {
  const { strategies, balanceTokens, token } = vaultItemData;
  return (
    <>
      {!strategies.length ? (
        <Typography>Has not strategies yet</Typography>
      ) : (
        strategies.map((strategy: any) => (
          <VaultStrategyItem
            strategyData={strategy}
            vaultBalanceTokens={balanceTokens}
            tokenName={token.name}
            key={strategy.id}
          />
        ))
      )}
    </>
  );
};

export default VaultItemStrategies;
