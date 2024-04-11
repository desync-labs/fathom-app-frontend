import { Dispatch, FC, memo, SetStateAction } from "react";
import { Box, Button, styled } from "@mui/material";
import { IVaultPosition } from "fathom-sdk";
import BigNumber from "bignumber.js";
import { VaultInfoTabs } from "hooks/useVaultListItem";

export const VaultNavWrapper = styled(Box)`
  height: 50px;
  width: 100%;
  border-bottom: 1.5px solid #1d2d49;
  display: flex;
  align-items: center;
  padding: 5px 20px 0 20px;
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
  font-size: 15px;
  text-transform: none;
  color: #9fadc6;
  background: unset;
  border-radius: 0;
  padding: 8px 18px;

  &.active {
    color: #fff;
    font-weight: 600;
    border-bottom: 1px solid #00fff6;
  }

  &:hover {
    background-color: unset;
  }
`;

type VaultListItemNavPropsType = {
  vaultPosition: IVaultPosition | null | undefined;
  activeVaultInfoTab: VaultInfoTabs;
  setActiveVaultInfoTab: Dispatch<SetStateAction<VaultInfoTabs>>;
};

const VaultListItemNav: FC<VaultListItemNavPropsType> = ({
  vaultPosition,
  activeVaultInfoTab,
  setActiveVaultInfoTab,
}) => {
  return (
    <VaultNavWrapper>
      {vaultPosition &&
        BigNumber(vaultPosition.balanceShares).isGreaterThan(0) && (
          <VaultNavItem
            onClick={() => setActiveVaultInfoTab(VaultInfoTabs.POSITION)}
            className={
              activeVaultInfoTab === VaultInfoTabs.POSITION ? "active" : ""
            }
          >
            Your position
          </VaultNavItem>
        )}
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
      <VaultNavItem
        onClick={() => setActiveVaultInfoTab(VaultInfoTabs.MANAGEMENT)}
        className={
          activeVaultInfoTab === VaultInfoTabs.MANAGEMENT ? "active" : ""
        }
      >
        Management
      </VaultNavItem>
    </VaultNavWrapper>
  );
};

export default memo(VaultListItemNav);
