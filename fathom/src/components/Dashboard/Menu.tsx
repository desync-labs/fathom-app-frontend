import { useEffect, useState } from "react";
import { FC } from "react";
import {
  Dashboard as DashboardIcon,
  SwapHoriz as SwapHorizIcon,
  AddBox as AddBoxIcon,
  DensitySmall as DensitySmallIcon,
  BrowserUpdated as BrowserUpdatedIcon,
  LocalAtm as LocalAtmIcon
} from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import AppMenuItem from "../MenuItem/AppMenuItem";

type ItemPropsType = {
  open: boolean;
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

export const Menu: FC<ItemPropsType> = ({ open }) => {
  const location = useLocation();
  const isProposalsActive = location.pathname === "/proposals";
  const isMakeProposalActive = location.pathname === "/proposal/make-proposal";
  const isStableSwapActive = location.pathname === "/swap";
  const isDashboardActive = location.pathname === "/";
  const isStakingActive = location.pathname === '/staking'
  const isRewardsActive = location.pathname === '/rewards'

  const { showText } = useShowText(open);

  const appMenuItems = [
    {
      name: 'Dashboard',
      link: "/",
      Icon: DashboardIcon,
      isActive: isDashboardActive,
      showText,
    },
    {
      name: 'Stable Swap',
      link: "/swap",
      Icon: SwapHorizIcon,
      isActive: isStableSwapActive,
      showText,
    },
    {
      name: "Government",
      isActive: false,
      showText,
      items: [
        {
          name: "View all Proposals",
          showText,
          Icon: DensitySmallIcon,
          isActive: isProposalsActive,
          link: '/proposals'
        },
        {
          name: "Make a Proposal",
          Icon: AddBoxIcon,
          showText,
          isActive: isMakeProposalActive,
          link: '/proposal/make-proposal'
        },
      ],
    },
    {
      name: "Staking",
      isActive: false,
      showText,
      items: [
        {
          name: "Locking",
          showText,
          Icon: BrowserUpdatedIcon,
          isActive: isStakingActive,
          link: '/staking'
        },
      ],
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
