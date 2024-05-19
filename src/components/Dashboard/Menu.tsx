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
  LendingIcon,
} from "components/Common/MenuIcons";
import useConnector from "context/connector";
import AppMenuItem from "components/MenuItem/AppMenuItem";

type ItemPropsType = {
  open: boolean;
};

export const Menu: FC<ItemPropsType> = memo(({ open }) => {
  const location = useLocation();
  const { allowStableSwap, chainId } = useConnector();

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

  const isLendingActive = useMemo(
    () => location.pathname.includes("/lending"),
    [location.pathname]
  );

  const isVaultActive = useMemo(
    () => location.pathname.includes("vaults"),
    [location.pathname]
  );

  const isChartsActive = useMemo(
    () => location.pathname.includes("charts"),
    [location.pathname]
  );

  const { showText } = useShowText(open);

  let appMenuItems = [
    {
      name: "FXD",
      link: "/",
      Icon: <FxdIcon isactive={isDashboardActive ? "true" : ""} />,
      isActive: isDashboardActive,
      showText: showText,
    },
  ];

  /**
   * Add Lending Menu Item when it enabled.
   */
  appMenuItems = appMenuItems.concat(
    chainId === 11155111
      ? [
          {
            name: "Lending",
            link: "/lending",
            Icon: <LendingIcon isactive={isLendingActive ? "true" : ""} />,
            isActive: isLendingActive,
            showText: showText,
          },
          {
            name: "Vaults",
            link: "/vaults",
            Icon: <VaultIcon isactive={isVaultActive ? "true" : ""} />,
            isActive: isVaultActive,
            showText: showText,
          },
        ]
      : [
          {
            name: "Stable Swap",
            link: "/stable-swap",
            Icon: (
              <StableSwapIcon isactive={isStableSwapActive ? "true" : ""} />
            ),
            isActive: isStableSwapActive,
            showText: showText,
          },
          {
            name: "Lending",
            link: "/lending",
            Icon: <LendingIcon isactive={isLendingActive ? "true" : ""} />,
            isActive: isLendingActive,
            showText: showText,
          },
          {
            name: "Vaults",
            link: "/vaults",
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
          {
            name: "DAO",
            link: "/dao/staking",
            Icon: <GovernanceIcon isactive={isDAOActive ? "true" : ""} />,
            isActive: isDAOActive,
            showText: showText,
          },
        ]
  );

  if (!allowStableSwap) {
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
