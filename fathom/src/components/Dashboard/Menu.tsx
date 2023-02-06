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
};

export const Menu: FC<ItemPropsType> = ({ open }) => {
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
      showText: showText,
    },
    {
      name: "Stable Swap",
      link: "/swap",
      Icon: <SwapIcon isStableSwapActive={isStableSwapActive} />,
      isActive: isStableSwapActive,
      showText: showText,
    },
    {
      name: "DAO",
      link: "/dao/staking",
      Icon: <GovernanceIcon isDAOActive={isDAOActive} />,
      isActive: isDAOActive,
      showText: showText,
    },
    {
      name: 'DEX',
      link: 'https://swap.fathom.fi',
      Icon: <DexIcon />,
      target: '_blank',
      showText: showText,
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
