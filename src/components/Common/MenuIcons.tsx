import { FC } from "react";
import BorrowIconSrc from "assets/svg/borrow.svg";
import BorrowIconActiveSrc from "assets/svg/borrow-active.svg";
import SwapIconSrc from "assets/svg/stable-swap.svg";
import SwapIconActiveSrc from "assets/svg/stable-swap-active.svg";
import StakingIconSrc from "assets/svg/staking.svg";
import StakingIconActiveSrc from "assets/svg/staking-active.svg";
import GovernanceSrc from "assets/svg/governance.svg";
import GovernanceActiveSrc from "assets/svg/governance-active.svg";
import DexSrc from "assets/svg/dex.svg";
import DexSrcActive from "assets/svg/dex-active.svg";

import { styled } from "@mui/material/styles";
import { Icon } from "@mui/material";

const MenuIcon = styled(Icon)`
  margin-top: -3px;
`;

export const FxdIcon: FC<{ isDashboardActive: boolean }> = ({
  isDashboardActive,
}) => (
  <MenuIcon>
    <img
      src={isDashboardActive ? BorrowIconActiveSrc : BorrowIconSrc}
      alt="borrow-icon"
    />
  </MenuIcon>
);

export const SwapIcon: FC<{ isStableSwapActive: boolean }> = ({
  isStableSwapActive,
}) => (
  <MenuIcon>
    <img
      src={isStableSwapActive ? SwapIconActiveSrc : SwapIconSrc}
      alt="swap-icon"
    />
  </MenuIcon>
);

export const StakingIcon: FC<{ isStakingActive: boolean }> = ({
  isStakingActive,
}) => (
  <MenuIcon>
    <img
      alt="staking-icon"
      src={isStakingActive ? StakingIconActiveSrc : StakingIconSrc}
    />
  </MenuIcon>
);

export const GovernanceIcon: FC<{ isDAOActive: boolean }> = ({
  isDAOActive,
}) => (
  <MenuIcon sx={{ marginTop: "-9px" }}>
    <img
      alt="governance-icon"
      src={isDAOActive ? GovernanceActiveSrc : GovernanceSrc}
    />
  </MenuIcon>
);

export const DexIcon: FC<{ isDexActive: boolean }> = ({ isDexActive }) => (
  <Icon sx={{ height: "1.2em" }}>
    <img alt="dex-icon" src={isDexActive ? DexSrcActive : DexSrc} />
  </Icon>
);
