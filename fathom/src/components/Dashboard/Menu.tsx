import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FC } from "react";
import { useLocation } from "react-router-dom";
import AppMenuItem from "components/MenuItem/AppMenuItem";

import BorrowIconSrc from "assets/svg/borrow.svg";
import BorrowIconActiveSrc from "assets/svg/borrow-active.svg";
import SwapIconSrc from "assets/svg/stable-swap.svg";
import SwapIconActiveSrc from "assets/svg/stable-swap-active.svg";
import StakingIconSrc from "assets/svg/staking.svg";
import StakingIconActiveSrc from "assets/svg/staking-active.svg";
import GovernanceSrc from "assets/svg/governance.svg";
import GovernanceActiveSrc from "assets/svg/governance-active.svg";
import { Icon } from "@mui/material";
import { styled } from "@mui/material/styles";

const MenuIcon = styled(Icon)(({ theme }) => ({
  marginTop: "-3px",
}));

type ItemPropsType = {
  open: boolean;
  isMobile: boolean;
};

const useShowText = (open: boolean) => {
  const [showText, setShowText] = useState(true);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setShowText(open);
      }, 100);
    } else {
      setShowText(open);
    }
  }, [open, setShowText]);

  return {
    showText,
  };
};

export const Menu: FC<ItemPropsType> = ({ open, isMobile }) => {
  const location = useLocation();

  const isDashboardActive = useMemo(
    () => location.pathname === "/",
    [location.pathname]
  );
  const isStableSwapActive = useMemo(
    () => location.pathname === "/swap",
    [location.pathname]
  );
  const isGovernanceActive = useMemo(
    () => location.pathname === "/governance",
    [location.pathname]
  );
  const isStakingActive = useMemo(
    () => location.pathname === "/staking",
    [location.pathname]
  );

  const { showText } = useShowText(open);

  const FxdIcon = useCallback(
    () => (
      <MenuIcon>
        <img
          src={isDashboardActive ? BorrowIconActiveSrc : BorrowIconSrc}
          alt="borrow-icon"
        />
      </MenuIcon>
    ),
    [isDashboardActive]
  );

  const SwapIcon = useCallback(
    () => (
      <MenuIcon>
        <img
          src={isStableSwapActive ? SwapIconActiveSrc : SwapIconSrc}
          alt="swap-icon"
        />
      </MenuIcon>
    ),
    [isStableSwapActive]
  );

  const StakingIcon = useCallback(
    () => (
      <MenuIcon>
        <img
          alt="staking-icon"
          src={isStakingActive ? StakingIconActiveSrc : StakingIconSrc}
        />
      </MenuIcon>
    ),
    [isStakingActive]
  );

  const GovernanceIcon = useCallback(
    () => (
      <MenuIcon sx={{ marginTop: "-9px" }}>
        <img
          alt="governance-icon"
          src={isGovernanceActive ? GovernanceActiveSrc : GovernanceSrc}
        />
      </MenuIcon>
    ),
    [isGovernanceActive]
  );

  const appMenuItems = [
    {
      name: "FXD",
      link: "/",
      Icon: FxdIcon,
      isActive: isDashboardActive,
      showText: isMobile ? false : showText,
    },
    {
      name: "Stable Swap",
      link: "/swap",
      Icon: SwapIcon,
      isActive: isStableSwapActive,
      showText: isMobile ? false : showText,
    },
    {
      name: "Governance",
      link: "/governance",
      showText: isMobile ? false : showText,
      Icon: GovernanceIcon,
      isActive: isGovernanceActive,
    },
    {
      name: "Staking",
      showText: isMobile ? false : showText,
      Icon: StakingIcon,
      isActive: isStakingActive,
      link: "/staking",
    },
  ];

  return (
    <>
      {appMenuItems.map((item, index) => (
        <AppMenuItem {...item} key={index} />
      ))}
    </>
  );
};
