import React, { Dispatch, FC, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  DexIcon,
  FxdIcon,
  GovernanceIcon,
  SwapIcon,
} from "components/Common/MenuIcons";
import AppMenuItem from "components/MenuItem/AppMenuItem";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

const MobileMenuWrapper = styled(Box)`
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 300px;
  background: #131f35;
  z-index: 1000;
  padding-left: 12px;
  padding-right: 12px;
  padding-top: 20px;
  border-top: 1px solid #192c46;
  > a {
    margin-bottom: 14px;
  }
`;

type MobileMenuPropsType = {
  setOpenMobile: Dispatch<boolean>;
};

const MobileMenu: FC<MobileMenuPropsType> = ({ setOpenMobile }) => {
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

  const dexUrl = useMemo(
    () => process.env.REACT_APP_SWAP_APP_URL!,
    []
  );

  const appMenuItems = [
    {
      name: "FXD",
      link: "/",
      Icon: <FxdIcon isDashboardActive={isDashboardActive} />,
      isActive: isDashboardActive,
      showText: true,
    },
    {
      name: "Stable Swap",
      link: "/swap",
      Icon: <SwapIcon isStableSwapActive={isStableSwapActive} />,
      isActive: isStableSwapActive,
      showText: true,
    },
    {
      name: "DAO",
      link: "/dao/staking",
      Icon: <GovernanceIcon isDAOActive={isDAOActive} />,
      isActive: isDAOActive,
      showText: true,
    },
    {
      name: "DEX",
      link: dexUrl,
      Icon: <DexIcon />,
      target: "_blank",
      showText: true,
    },
  ];

  return (
    <MobileMenuWrapper onClick={() => setOpenMobile(false)}>
      {appMenuItems.map((item) => (
        <AppMenuItem {...item} key={item.name} />
      ))}
    </MobileMenuWrapper>
  );
};

export default MobileMenu;
