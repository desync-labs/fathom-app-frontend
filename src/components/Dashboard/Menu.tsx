import { FC, memo, useMemo } from "react";
import { useLocation } from "react-router-dom";

import useShowText from "hooks/General/useShowText";
import {
  DISPLAY_CHARTS,
  DISPLAY_DEX,
  DISPLAY_FXD,
  DISPLAY_GOVERNANCE,
  DISPLAY_LENDING,
  DISPLAY_STABLE_SWAP,
  DISPLAY_VAULTS,
  supportedChainIds,
} from "connectors/networks";
import useConnector from "context/connector";
import {
  ChartsIcon,
  DexIcon,
  FxdIcon,
  GovernanceIcon,
  LendingIcon,
  StableSwapIcon,
  VaultIcon,
} from "components/Common/MenuIcons";
import AppMenuItem from "components/MenuItem/AppMenuItem";
import { DEFAULT_CHAIN_ID } from "utils/Constants";

type ItemPropsType = {
  open: boolean;
};

export const Menu: FC<ItemPropsType> = memo(({ open }) => {
  const location = useLocation();
  const { allowStableSwap, chainId } = useConnector();

  const checkedChainId = useMemo(
    () => (supportedChainIds.includes(chainId) ? chainId : DEFAULT_CHAIN_ID),
    [chainId]
  );

  const isDashboardActive = useMemo(
    () => location.pathname.includes("fxd"),
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

  const appMenuItems = [];

  if (DISPLAY_FXD.includes(checkedChainId)) {
    appMenuItems.push({
      name: "FXD",
      link: "/fxd",
      Icon: <FxdIcon isactive={isDashboardActive ? "true" : ""} />,
      isActive: isDashboardActive,
      showText: showText,
    });
  }

  if (DISPLAY_STABLE_SWAP.includes(checkedChainId)) {
    appMenuItems.push({
      name: "Stable Swap",
      link: "/stable-swap",
      Icon: <StableSwapIcon isactive={isStableSwapActive ? "true" : ""} />,
      isActive: isStableSwapActive,
      showText: showText,
    });
  }

  if (DISPLAY_LENDING.includes(checkedChainId)) {
    appMenuItems.push({
      name: "Lending",
      link: "/lending",
      Icon: <LendingIcon isactive={isLendingActive ? "true" : ""} />,
      isActive: isLendingActive,
      showText: showText,
    });
  }

  if (DISPLAY_VAULTS.includes(checkedChainId)) {
    appMenuItems.push({
      name: "Vaults",
      link: "/vaults",
      Icon: <VaultIcon isactive={isVaultActive ? "true" : ""} />,
      isActive: isVaultActive,
      showText: showText,
    });
  }

  if (DISPLAY_DEX.includes(checkedChainId)) {
    appMenuItems.push({
      name: "DEX",
      link: "/swap",
      Icon: <DexIcon isactive={isDexActive ? "true" : ""} />,
      isActive: isDexActive,
      showText: showText,
    });
  }

  if (DISPLAY_CHARTS.includes(checkedChainId)) {
    appMenuItems.push({
      name: "Charts",
      link: "/charts",
      Icon: <ChartsIcon isactive={isChartsActive ? "true" : ""} />,
      isActive: isChartsActive,
      showText: showText,
    });
  }

  if (DISPLAY_GOVERNANCE.includes(checkedChainId)) {
    appMenuItems.push({
      name: "DAO",
      link: "/dao/staking",
      Icon: <GovernanceIcon isactive={isDAOActive ? "true" : ""} />,
      isActive: isDAOActive,
      showText: showText,
    });
  }

  if (!allowStableSwap && DISPLAY_STABLE_SWAP.includes(checkedChainId)) {
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
