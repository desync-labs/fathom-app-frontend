import React, { useMemo } from "react";
import { FC } from "react";
import { useLocation } from "react-router-dom";
import AppMenuItem from "components/MenuItem/AppMenuItem";

import useShowText from "hooks/useShowText";
import {
  FxdIcon,
  GovernanceIcon,
  SwapIcon,
  FarmIcon,
  DexIcon
} from "components/Common/MenuIcons";
import useConnector from "context/connector";

type ItemPropsType = {
  open: boolean;
};

export const Menu: FC<ItemPropsType> = ({ open }) => {
  const location = useLocation();
  const { allowStableSwap, isUserWrapperWhiteListed } = useConnector();

  const isDashboardActive = useMemo(
    () => location.pathname === "/",
    [location.pathname]
  );
  const isStableSwapActive = useMemo(
    () => location.pathname.includes("swap"),
    [location.pathname]
  );
  const isDAOActive = useMemo(
    () => location.pathname.includes("dao"),
    [location.pathname]
  );

  const isFarmActive = useMemo(
    () => location.pathname.includes("farm") , [location.pathname]);
  const { showText } = useShowText(open);

  const dexUrl = useMemo(() => process.env.REACT_APP_SWAP_APP_URL!, []);

  const appMenuItems = [
    {
      name: "FXD",
      link: "/",
      Icon: <FxdIcon isDashboardActive={isDashboardActive} />,
      isActive: isDashboardActive,
      showText: showText
    },
    {
      name: "Stable Swap",
      link: "/swap",
      Icon: <SwapIcon isStableSwapActive={isStableSwapActive} />,
      isActive: isStableSwapActive,
      showText: showText
    },
    {
      name: "DAO",
      link: "/dao/staking",
      Icon: <GovernanceIcon isDAOActive={isDAOActive} />,
      isActive: isDAOActive,
      showText: showText
    },
    {
      name: "Farm",
      link: "/farm",
      Icon: <FarmIcon isFarmActive={isFarmActive} />,
      isActive: isDAOActive,
      showText: showText
    },
    {
      name: "DEX",
      link: dexUrl,
      Icon: <DexIcon />,
      target: "_blank",
      showText: showText
    }
  ];

  if (!allowStableSwap && !isUserWrapperWhiteListed) {
    appMenuItems.splice(1, 1);
  }

  return (
    <>
      {appMenuItems.map((item, index) => (
        <AppMenuItem {...item} key={item.name} />
      ))}
    </>
  );
};
