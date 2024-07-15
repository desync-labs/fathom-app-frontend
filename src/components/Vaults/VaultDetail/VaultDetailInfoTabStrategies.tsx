import { memo, useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Button, ButtonGroup, styled, Typography } from "@mui/material";
import { IVaultStrategy } from "fathom-sdk";
import useVaultContext from "context/vault";
import { strategyTitle } from "utils/Vaults/getStrategyTitleAndDescription";
import VaultStrategyItem from "components/Vaults/VaultDetail/VaultStrategyItem";
import { VaultStrategiesSkeleton } from "components/Base/Skeletons/VaultSkeletons";

export const VaultInfoWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  padding-top: 24px;
`;

export const StrategySelectorLabel = styled(Typography)`
  color: #b7c8e5;
  font-size: 11px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0.44px;
  text-transform: uppercase;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 14px;
    text-transform: capitalize;
    margin-bottom: 10px;
  }
`;

export const StrategySelector = styled(ButtonGroup)`
  flex-wrap: nowrap;
  gap: 16px;
  width: auto;
  overflow-x: auto;
  border-radius: unset;
  border-bottom: 1px solid #43fff1;
  padding: 8px 0 16px 0;
  overflow-x: scroll;
  width: 100%;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-track {
    background: #1e2f4d;
  }
  &::-webkit-scrollbar-thumb {
    background: #43fff1;
    border-radius: 4px;
  }

  & .MuiButton-root {
    width: fit-content;
    min-width: unset;
    height: auto;
    color: #566e99;
    font-size: 16px;
    font-weight: 400;
    white-space: nowrap;
    border-radius: 8px;
    border: 1px solid #2c4066;
    background: #1e2f4d;
    padding: 10px 24px;

    &:hover {
      border-color: currentColor;
    }

    &.activeStrategyItem {
      color: #fff;
      border: 1px solid #43fff1;
      background: #1e2f4d;
    }
  }
  ${({ theme }) => theme.breakpoints.down("sm")} {
    flex-direction: column;
    gap: 6px;
    width: 100%;
    overflow: hidden;

    & .MuiButton-root {
      width: 100%;
      font-size: 14px;
      margin-left: 0;
      padding: 10px;
    }
  }
`;

const NoStrategiesTitle = styled(Typography)`
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 16px 8px 24px;
  }
`;

const VaultDetailInfoTabStrategies = () => {
  const {
    vault,
    vaultLoading,
    performanceFee,
    reports,
    historicalApr,
    isReportsLoaded,
    urlParams,
  } = useVaultContext();
  const { strategies, balanceTokens, token } = vault;
  const location = useLocation();

  const [activeStrategy, setActiveStrategy] = useState<string>("");

  useEffect(() => {
    if (!strategies || !strategies.length) return;

    let params: string | string[] = urlParams || "";
    params = params.split("/");
    const strategyIndex = params.indexOf("strategy");
    if (strategyIndex !== -1) {
      const strategyId = params[strategyIndex + 1];
      setActiveStrategy(strategyId);
    } else {
      setActiveStrategy(strategies[0].id);
    }
  }, [urlParams, setActiveStrategy, strategies]);

  const setActiveStrategyHandler = useCallback(
    (strategyId: string) => {
      let params: string | string[] = urlParams || "";
      params = params ? params.split("/") : [];
      const strategyIndex = params.indexOf("strategy");
      const tabIndex = params.indexOf("tab");
      if (strategyIndex !== -1) {
        const replaceString = `strategy/${params[strategyIndex + 1]}`;
        const replaceValue =
          tabIndex === -1
            ? `tab/strategies/strategy/${strategyId.toLowerCase()}`
            : `strategy/${strategyId.toLowerCase()}`;
        window.history.replaceState(
          undefined,
          "",
          `#${location.pathname.replace(replaceString, replaceValue)}`
        );
      } else {
        const urlValue = `#${
          location.pathname
        }/tab/strategies/strategy/${strategyId.toLowerCase()}`;
        window.history.replaceState(undefined, "", urlValue);
      }
      setActiveStrategy(strategyId);
    },
    [urlParams, setActiveStrategy, location]
  );

  if (!vault?.strategies?.length && !vaultLoading) {
    return (
      <VaultInfoWrapper>
        <NoStrategiesTitle>Has no strategies yet</NoStrategiesTitle>
      </VaultInfoWrapper>
    );
  }

  return (
    <VaultInfoWrapper>
      {vaultLoading ? (
        <VaultStrategiesSkeleton />
      ) : (
        <>
          <Box>
            <StrategySelectorLabel>Strategy</StrategySelectorLabel>
            <StrategySelector>
              {strategies.map((strategy: IVaultStrategy, index: number) => (
                <Button
                  key={strategy.id}
                  onClick={() => setActiveStrategyHandler(strategy.id)}
                  className={
                    activeStrategy === strategy.id
                      ? "activeStrategyItem"
                      : "strategyItem"
                  }
                >
                  {strategyTitle[strategy.id.toLowerCase()] ? (
                    strategyTitle[strategy.id.toLowerCase()]
                  ) : (
                    <>
                      FXD: Direct Incentive - Educational Strategy {index + 1}
                    </>
                  )}
                </Button>
              ))}
            </StrategySelector>
          </Box>
          {strategies.map((strategy: IVaultStrategy, index: number) => (
            <VaultStrategyItem
              vaultId={vault.id}
              strategyData={strategy}
              reports={reports[strategy.id] || []}
              historicalApr={historicalApr[strategy.id] || []}
              vaultBalanceTokens={balanceTokens}
              tokenName={token.name}
              performanceFee={performanceFee}
              index={index}
              isShow={activeStrategy === strategy.id}
              key={strategy.id}
              reportsLoading={!isReportsLoaded}
            />
          ))}
        </>
      )}
    </VaultInfoWrapper>
  );
};

export default memo(VaultDetailInfoTabStrategies);
