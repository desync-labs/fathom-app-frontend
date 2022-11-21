import { Box, Button } from "@mui/material";
import * as React from "react";
import ILockPosition from "stores/interfaces/ILockPosition";
import { Dispatch, FC, useEffect, useRef, useState } from "react";
import useStakingView from "hooks/useStakingView";
import { styled } from "@mui/material/styles";
import StakingCountdown from "components/Staking/StakingCountdown";
import { secondsToTime } from "utils/secondsToTime";

import clockSrc from "assets/svg/clock-circle.svg";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Popper from "@mui/material/Popper";
import Grow from "@mui/material/Grow";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import { AppPaper } from "components/AppComponents/AppPaper/AppPaper";

const StakingViewItemWrapper = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  padding: 16px 24px;
  background: #131f35;
  border-radius: 8px;
  margin: 3px 0;
`;

export const StakingViewItemLabel = styled(Box)`
  font-weight: 700;
  font-size: 13px;
  line-height: 16px;
  color: #6379a1;
  text-transform: uppercase;
`;

export const StakingViewItemValue = styled(Box)`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #fff;
  font-size: 16px;
  line-height: 24px;
  &.blue {
    color: #5a81ff;
  }
`;

const Row = styled(Box)`
  display: grid;
  justify-content: start;
  align-items: center;
`;

const RewardsUnstakeWrapper = styled(Box)`
  display: grid;
  grid-template-columns: 1.75fr 1.25fr 1fr;
  background: #061023;
  border-radius: 12px;
  height: 68px;
  align-items: center;
  padding: 16px 8px 16px 24px;
`;

const ClaimRewardsButton = styled(Button)`
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
  color: #fff;
  text-transform: none;
`;

const UnstakePaper = styled(AppPaper)`
  background: #253656;
  border: 1px solid #4f658c;
  box-shadow: 0px 12px 32px #000715;
  border-radius: 8px;
  padding: 4px;

  ul {
    padding: 0;
    li {
      padding: 10px 16px;
      &:hover {
        background: #324567;
        border-radius: 6px;
      }
    }
  }
`;

const UnstakeButton = styled(Button)`
  text-transform: none;
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
  color: #43fff1;
  background: none;
  box-shadow: none;

  &:hover {
    background: none;
  }
`;

type StakingViewItemPropsType = {
  lockPosition: ILockPosition;
  token: string;
  setUnstake: Dispatch<null | ILockPosition>;
  setEarlyUnstake: Dispatch<null | ILockPosition>;
  setRewardsPosition: Dispatch<null | ILockPosition>;
};

const StakingViewItem: FC<StakingViewItemPropsType> = ({
  lockPosition,
  token,
  setUnstake,
  setEarlyUnstake,
  setRewardsPosition,
}) => {
  const [timer, setTimer] = useState();
  const [seconds, setSeconds] = useState(lockPosition.timeObject.seconds);
  const [open, setOpen] = useState<boolean>(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const { isUnlockable } = useStakingView();

  useEffect(() => {
    if (lockPosition.EndTime <= 0) {
      return setSeconds(0);
    }

    const interval = setInterval( () => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    // @ts-ignore
    setTimer(interval);

    return () => {
      clearInterval(timer);
    };
  }, [setTimer, setSeconds]);

  return (
    <StakingViewItemWrapper>
      <Row>
        <StakingViewItemLabel>Lock position</StakingViewItemLabel>
        <StakingViewItemLabel>Vote power</StakingViewItemLabel>
        <StakingViewItemLabel>Stream rewards</StakingViewItemLabel>
        <StakingViewItemLabel>Remaining time</StakingViewItemLabel>
      </Row>
      <Row>
        <StakingViewItemValue>
          {lockPosition.MAINTokenBalance} { token }
        </StakingViewItemValue>
        <StakingViewItemValue className={"blue"}>
          {lockPosition.VOTETokenBalance
            ? lockPosition.VOTETokenBalance
            : "None"}
        </StakingViewItemValue>
        <StakingViewItemValue className={"blue"}>
          {lockPosition.RewardsAvailable} { token }
        </StakingViewItemValue>
        <StakingViewItemValue>
          <img src={clockSrc} alt={"clock-circle"} />
          <StakingCountdown timeObject={secondsToTime(seconds)} />
        </StakingViewItemValue>
      </Row>
      <RewardsUnstakeWrapper>
        <Box>
          <StakingViewItemValue>
            {lockPosition.RewardsAvailable} { token }
          </StakingViewItemValue>
        </Box>
        <Box>
          {lockPosition.RewardsAvailable && (
            <ClaimRewardsButton
              onClick={() => setRewardsPosition(lockPosition)}
            >
              Claim Rewards
            </ClaimRewardsButton>
          )}
        </Box>
        <Box>
          <ButtonGroup variant="text" ref={anchorRef} aria-label="split button">
            <UnstakeButton
              size="small"
              aria-controls={open ? "split-button-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-label="select merge strategy"
              aria-haspopup="menu"
              onClick={() => setOpen(!open)}
            >
              Unstake
              <ArrowDropDownIcon />
            </UnstakeButton>
          </ButtonGroup>
          <Popper
            sx={{
              zIndex: 1,
            }}
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: "center bottom",
                }}
              >
                <UnstakePaper>
                  <ClickAwayListener onClickAway={() => setOpen(false)}>
                    <MenuList id="split-button-menu" autoFocusItem>
                      {isUnlockable(seconds) && (
                        <MenuItem onClick={() => setUnstake(lockPosition)}>
                          Unstake
                        </MenuItem>
                      )}
                      {!isUnlockable(seconds) && (
                        <MenuItem onClick={() => setEarlyUnstake(lockPosition)}>
                          Early Unstake
                        </MenuItem>
                      )}
                    </MenuList>
                  </ClickAwayListener>
                </UnstakePaper>
              </Grow>
            )}
          </Popper>
        </Box>
      </RewardsUnstakeWrapper>
    </StakingViewItemWrapper>
  );
};

export default StakingViewItem;
