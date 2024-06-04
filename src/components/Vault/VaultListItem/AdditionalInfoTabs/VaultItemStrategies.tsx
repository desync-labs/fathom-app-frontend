import { FC, memo } from "react";
import { styled, Typography } from "@mui/material";
import { IVault, IVaultStrategy, IVaultStrategyReport } from "fathom-sdk";
import VaultStrategyItem from "components/Vault/VaultListItem/AdditionalInfoTabs/VaultStrategyItem";
import { IVaultStrategyHistoricalApr } from "hooks/useVaultListItem";

const NoStrategiesTitle = styled(Typography)`
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 16px 8px 24px;
  }
`;

type VaultItemStrategiesPropsTypes = {
  vaultItemData: IVault;
  performanceFee: number;
  reports: Record<string, IVaultStrategyReport[]>;
  historicalApr: Record<string, IVaultStrategyHistoricalApr[]>;
};

const VaultItemStrategies: FC<VaultItemStrategiesPropsTypes> = ({
  vaultItemData,
  performanceFee,
  reports,
  historicalApr,
}) => {
  const { strategies, balanceTokens, token } = vaultItemData;
  return (
    <>
      {!strategies.length ? (
        <NoStrategiesTitle>Has no strategies yet</NoStrategiesTitle>
      ) : (
        strategies.map((strategy: IVaultStrategy, index: number) => (
          <VaultStrategyItem
            vaultId={vaultItemData.id}
            strategyData={strategy}
            reports={reports[strategy.id] || []}
            historicalApr={historicalApr[strategy.id] || []}
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
