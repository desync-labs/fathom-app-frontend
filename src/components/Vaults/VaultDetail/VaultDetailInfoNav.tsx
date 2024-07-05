import { memo } from "react";
import { styled } from "@mui/material";
import { VaultInfoTabs } from "hooks/Vaults/useVaultDetail";
import useVaultContext from "context/vault";
import {
  AppNavItem,
  AppNavWrapper,
} from "components/AppComponents/AppTabs/AppTabs";

const VaultNavWrapper = styled(AppNavWrapper)`
  ${({ theme }) => theme.breakpoints.down("sm")} {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 24px;
    width: 100%;
    background: #2c4066;
    padding: 0 16px;
    z-index: 9;
  }
`;
const VaultNavItem = styled(AppNavItem)`
  ${({ theme }) => theme.breakpoints.down("sm")} {
    height: 48px;
    width: fit-content;
    min-width: unset;
    font-size: 11px;
    font-weight: 600;
    padding: 0;
  }
`;

const VaultDetailInfoNav = () => {
  const {
    activeVaultInfoTab,
    managedStrategiesIds,
    isUserManager,
    setActiveVaultInfoTabHandler,
  } = useVaultContext();

  return (
    <VaultNavWrapper>
      <VaultNavItem
        onClick={() => setActiveVaultInfoTabHandler(VaultInfoTabs.ABOUT)}
        className={activeVaultInfoTab === VaultInfoTabs.ABOUT ? "active" : ""}
      >
        About
      </VaultNavItem>
      <VaultNavItem
        onClick={() => setActiveVaultInfoTabHandler(VaultInfoTabs.STRATEGIES)}
        className={
          activeVaultInfoTab === VaultInfoTabs.STRATEGIES ? "active" : ""
        }
      >
        Strategies
      </VaultNavItem>
      {isUserManager && (
        <VaultNavItem
          onClick={() =>
            setActiveVaultInfoTabHandler(VaultInfoTabs.MANAGEMENT_VAULT)
          }
          className={
            activeVaultInfoTab === VaultInfoTabs.MANAGEMENT_VAULT
              ? "active"
              : ""
          }
        >
          Vault Manager
        </VaultNavItem>
      )}
      {managedStrategiesIds.length > 0 && (
        <VaultNavItem
          onClick={() =>
            setActiveVaultInfoTabHandler(VaultInfoTabs.MANAGEMENT_STRATEGY)
          }
          className={
            activeVaultInfoTab === VaultInfoTabs.MANAGEMENT_STRATEGY
              ? "active"
              : ""
          }
        >
          Strategies Manager
        </VaultNavItem>
      )}
    </VaultNavWrapper>
  );
};

export default memo(VaultDetailInfoNav);
