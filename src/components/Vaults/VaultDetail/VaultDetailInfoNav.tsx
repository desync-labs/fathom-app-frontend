import { memo } from "react";
import { Box, Button, styled } from "@mui/material";
import { VaultInfoTabs } from "hooks/useVaultDetail";
import useVaultContext from "context/vault";

export const VaultNavWrapper = styled(Box)`
  width: fit-content;
  border-bottom: 1.5px solid #1d2d49;
  display: flex;
  align-items: center;
  padding: 0;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    padding: 0;
  }
`;

export const VaultNavItem = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 100%;
  font-size: 16px;
  font-weight: 600;
  text-transform: none;
  color: #9fadc6;
  background: unset;
  border-radius: 0;
  padding: 8px 18px;

  &.active {
    color: #fff;
    border-bottom: 1px solid #00fff6;
  }

  &:hover {
    background-color: unset;
  }
`;

const VaultDetailInfoNav = () => {
  const {
    activeVaultInfoTab,
    setActiveVaultInfoTab,
    managedStrategiesIds,
    isUserManager,
  } = useVaultContext();
  return (
    <VaultNavWrapper>
      <VaultNavItem
        onClick={() => setActiveVaultInfoTab(VaultInfoTabs.ABOUT)}
        className={activeVaultInfoTab === VaultInfoTabs.ABOUT ? "active" : ""}
      >
        About
      </VaultNavItem>
      <VaultNavItem
        onClick={() => setActiveVaultInfoTab(VaultInfoTabs.STRATEGIES)}
        className={
          activeVaultInfoTab === VaultInfoTabs.STRATEGIES ? "active" : ""
        }
      >
        Strategies
      </VaultNavItem>
      {isUserManager && (
        <VaultNavItem
          onClick={() => setActiveVaultInfoTab(VaultInfoTabs.MANAGEMENT_VAULT)}
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
            setActiveVaultInfoTab(VaultInfoTabs.MANAGEMENT_STRATEGY)
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
