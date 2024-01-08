import { memo, useMemo } from "react";
import { FC } from "react";
import { useLocation } from "react-router-dom";

import useShowText from "hooks/useShowText";
import {
  FxdIcon,
  GovernanceIcon,
  StableSwapIcon,
  VaultIcon,
  DexIcon,
  ChartsIcon,
} from "components/Common/MenuIcons";
import useConnector from "context/connector";
import AppMenuItem from "components/MenuItem/AppMenuItem";

type ItemPropsType = {
  open: boolean;
};

export const Menu: FC<ItemPropsType> = memo(({ open }) => {
  const location = useLocation();
  const { allowStableSwap, isUserWrapperWhiteListed } = useConnector();

  const isDashboardActive = useMemo(
    () => location.pathname === "/",
    [location.pathname]
  );
  const isStableSwapActive = useMemo(
    () => location.pathname.includes("/stable-swap"),
    [location.pathname]
  );
  const isDAOActive = useMemo(
    () => location.pathname.includes("dao"),
    [location.pathname]
  );
  const isDexActive = useMemo(
    () => location.pathname.includes("/swap"),
    [location.pathname]
  );

  const isVaultActive = useMemo(
    () => location.pathname.includes("vault"),
    [location.pathname]
  );

  const isChartsActive = useMemo(
    () => location.pathname.includes("charts"),
    [location.pathname]
  );

  const { showText } = useShowText(open);

  const appMenuItems = [
    {
      name: "FXD",
      link: "/",
      Icon: <FxdIcon isactive={isDashboardActive ? "true" : ""} />,
      isActive: isDashboardActive,
      showText: showText,
    },
    {
      name: "Stable Swap",
      link: "/stable-swap",
      Icon: <StableSwapIcon isactive={isStableSwapActive ? "true" : ""} />,
      isActive: isStableSwapActive,
      showText: showText,
    },
    {
      name: "DAO",
      link: "/dao/staking",
      Icon: <GovernanceIcon isactive={isDAOActive ? "true" : ""} />,
      isActive: isDAOActive,
      showText: showText,
    },
    {
      name: "Vault",
      link: "/vault",
      Icon: <VaultIcon isactive={isVaultActive ? "true" : ""} />,
      isActive: isVaultActive,
      showText: showText,
    },
    {
      name: "DEX",
      link: "/swap",
      Icon: <DexIcon isactive={isDexActive ? "true" : ""} />,
      isActive: isDexActive,
      showText: showText,
    },
    {
      name: "Charts",
      link: "/charts",
      Icon: <ChartsIcon isactive={isChartsActive ? "true" : ""} />,
      isActive: isChartsActive,
      showText: showText,
    },
  ];

  if (!allowStableSwap && !isUserWrapperWhiteListed) {
    appMenuItems.splice(1, 1);
  }

  return (
    <>
      {appMenuItems.map((item) => (
        <AppMenuItem {...item} key={item.name} />
      ))}
    </>
  );
});
