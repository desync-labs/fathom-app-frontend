import React, { useMemo } from "react";
import { FC } from "react";
import { useLocation } from "react-router-dom";
import AppMenuItem from "components/MenuItem/AppMenuItem";


import useShowText from "hooks/useShowText";
import {
  FxdIcon,
  GovernanceIcon,
  SwapIcon,
  DexIcon
} from "components/Common/MenuIcons";

type ItemPropsType = {
  open: boolean;
  isMobile: boolean;
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
      link: "/dao/staking",
      showText: isMobile ? false : showText,
      Icon: <GovernanceIcon isDAOActive={isDAOActive} />,
      isActive: isDAOActive,
    },
    {
      name: 'DEX',
      link: 'https://swap.fathom.fi',
      showText: isMobile ? false : showText,
      Icon: <DexIcon />,
      target: '_blank'
    }
  ];

  return (
    <>
      {appMenuItems.map((item, index) => (
        <AppMenuItem {...item} key={item.name} />
      ))}
    </>
  );
};
