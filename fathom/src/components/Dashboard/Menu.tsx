import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FC } from "react";
import {
  AddBox as AddBoxIcon,
  DensitySmall as DensitySmallIcon,
} from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import AppMenuItem from "../MenuItem/AppMenuItem";

import BorrowIconSrc from "../../assets/svg/borrow.svg";
import BorrowIconActiveSrc from "../../assets/svg/borrow-active.svg";
import SwapIconSrc from "../../assets/svg/stable-swap.svg";
import SwapIconActiveSrc from "../../assets/svg/stable-swap-active.svg";
import StakingIconSrc from "../../assets/svg/staking.svg";
import StakingIconActiveSrc from "../../assets/svg/staking-active.svg";
import { Icon } from "@mui/material";

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

  const isDashboardActive = useMemo(
    () => location.pathname === "/",
    [location.pathname]
  );
  const isStableSwapActive = useMemo(
    () => location.pathname === "/swap",
    [location.pathname]
  );
  const isProposalsActive = useMemo(
    () => location.pathname === "/governance",
    [location.pathname]
  );
  const isMakeProposalActive = useMemo(
    () => location.pathname === "/proposal/make-proposal",
    [location.pathname]
  );
  const isStakingActive = useMemo(
    () => location.pathname === "/staking",
    [location.pathname]
  );

  const { showText } = useShowText(open);

  const BorrowIcon = useCallback(
    () => (
      <Icon>
        <img
          src={isDashboardActive ? BorrowIconActiveSrc : BorrowIconSrc}
          alt="borrow-icon"
        />
      </Icon>
    ),
    [isDashboardActive]
  );

  const SwapIcon = useCallback(
    () => (
      <Icon>
        <img
          src={isStableSwapActive ? SwapIconActiveSrc : SwapIconSrc}
          alt="swap-icon"
        />
      </Icon>
    ),
    [isStableSwapActive]
  );

  const Staking = useCallback(
    () => (
      <Icon>
        <img
          alt="staking-icon"
          src={isStakingActive ? StakingIconActiveSrc : StakingIconSrc}
        />
      </Icon>
    ),
    [isStakingActive]
  );

  const appMenuItems = [
    {
      name: "Borrow",
      link: "/",
      Icon: BorrowIcon,
      isActive: isDashboardActive,
      showText,
    },
    {
      name: "Stable Swap",
      link: "/swap",
      Icon: SwapIcon,
      isActive: isStableSwapActive,
      showText,
    },
    {
      name: "Governance",
      isActive: false,
      showText,
      items: [
        {
          name: "View all Proposals",
          showText,
          Icon: DensitySmallIcon,
          isActive: isProposalsActive,
          link: "/governance",
        },
        {
          name: "Make a Proposal",
          Icon: AddBoxIcon,
          showText,
          isActive: isMakeProposalActive,
          link: "/proposal/make-proposal",
        },
      ],
    },
    {
      name: "Staking",
      showText,
      Icon: Staking,
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
