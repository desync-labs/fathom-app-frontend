import { FC, memo } from "react";
import { styled, Typography } from "@mui/material";
import { IVault } from "fathom-sdk";
import VaultStrategyItem from "components/Vault/VaultListItem/AdditionalInfoTabs/VaultStrategyItem";

const NoStrategiesTitle = styled(Typography)`
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 16px 8px 24px;
  }
`;

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
        <NoStrategiesTitle>Has no strategies yet</NoStrategiesTitle>
      ) : (
        strategies.map((strategy: any, index: number) => (
          <VaultStrategyItem
            vaultId={vaultItemData.id}
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
