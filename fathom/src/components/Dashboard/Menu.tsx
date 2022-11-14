import React, { useEffect, useMemo, useState } from "react";
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

const FxdIcon: FC<{ isDashboardActive: boolean }> = ({ isDashboardActive }) => (
  <MenuIcon>
    <img
      src={isDashboardActive ? BorrowIconActiveSrc : BorrowIconSrc}
      alt="borrow-icon"
    />
  </MenuIcon>
);

const SwapIcon: FC<{ isStableSwapActive: boolean }> = ({
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
  const isDAOActive = useMemo(
    () => location.pathname.includes("dao"),
    [location.pathname]
  );

  const { showText } = useShowText(open);

  const appMenuItems = [
    {
      name: "FXD",
      link: "/",
      Icon: <FxdIcon isDashboardActive={isDashboardActive} />,
      isActive: isDashboardActive,
      showText: isMobile ? false : showText,
    },
    {
      name: "Stable Swap",
      link: "/swap",
      Icon: <SwapIcon isStableSwapActive={isStableSwapActive} />,
      isActive: isStableSwapActive,
      showText: isMobile ? false : showText,
    },
    {
      name: "DAO",
      link: "/dao/proposals",
      showText: isMobile ? false : showText,
      Icon: <GovernanceIcon isDAOActive={isDAOActive} />,
      isActive: isDAOActive,
    },
    // {
    //   name: "Staking",
    //   showText: isMobile ? false : showText,
    //   Icon: <StakingIcon isStakingActive={isStakingActive} />,
    //   isActive: isStakingActive,
    //   link: "/staking",
    // },
  ];

  return (
    <>
      {appMenuItems.map((item, index) => (
        <AppMenuItem {...item} key={item.name} />
      ))}
    </>
  );
};
