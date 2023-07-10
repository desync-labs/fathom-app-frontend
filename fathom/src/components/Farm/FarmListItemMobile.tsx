import React from "react";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import {
  ListItemWrapper,
  ListLabel,
  ListValue
} from "components/AppComponents/AppList/AppList";

import {
  ExtendedBtn,
  FarmDescription,
  FarmInfo,
  FarmingLabel,
  FarmItemInfoWrapper,
  FarmListItemImageWrapper,
  FarmPercent,
  FarmStacked,
  FarmTitle
} from "components/Farm/FarmListItem";
import FarmListItemPairInfo from "components/Farm/FarmListItem/FarmListItemPairInfo";
import FarmListItemFarmInfo from "components/Farm/FarmListItem/FarmListItemFarmInfo";
import FarmListItemFarmingDetails from "components/Farm/FarmListItem/FarmListItemFarmingDetails";
import FarmListItemEarned from "components/Farm/FarmListItem/FarmListItemEarned";
import FarmListItemManageModal from "components/Farm/FarmListItem/FarmListItemManageModal";

import { getTokenLogoURL } from "utils/tokenLogo";
import useFarmListItem from "hooks/useFarmListItem";

import DirectionUp from "assets/svg/direction-up.svg";
import DirectionDown from "assets/svg/direction-down.svg";
import LockSrc from "assets/svg/lock.svg";

const FarmPoolName = styled('div')`
  display: flex;
  justify-content: left;
  align-items: center;
  gap: 7px;
  margin-bottom: 10px;
`

const FarmListItemMobileContainer = styled(Box)`
  width: 100%;
  background: #131f35;
  border-bottom: 1px solid #131f35;
  border-radius: 8px;
  padding: 20px 16px;
  margin-bottom: 5px;
`;

export const FarmListValue = styled(ListValue)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 7px;

  &.neutral {
    font-size: 14px;
    color: #6D86B2;
    line-height: 20px;
    font-weight: 600;
  }
`;

export const FarmListLabel = styled(ListLabel)`
  color: #6D86B2;
  font-weight: 600;
  font-size: 11px;
  line-height: 16px;
`;

const ExtendedBtnWrapper = styled("div")`
  height: 36px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const FarmListItemMobileAdditionalData = () => {
  return (
    <>
      <ListItemWrapper>
        <FarmListLabel>Staked liquidity</FarmListLabel>
        <FarmListValue>
          $494.498
        </FarmListValue>
      </ListItemWrapper>
      <ListItemWrapper>
        <FarmListLabel>Available</FarmListLabel>
        <FarmListValue className={"neutral"}>
          0 LP
        </FarmListValue>
      </ListItemWrapper>
      <ListItemWrapper>
        <FarmListLabel>Staked</FarmListLabel>
        <FarmListValue className={"neutral"}>
          <FarmStacked>
            <div className={"img-wrapper"}>
              <img src={LockSrc} alt={"locked"} width={20} height={20} />
            </div>
            0 LP
          </FarmStacked>
        </FarmListValue>
      </ListItemWrapper>
    </>
  );
};


const FarmListItemMobile = () => {
  const { manageFarm, setManageFarm, extended, setExtended, isMobile } = useFarmListItem();

  return (
    <FarmListItemMobileContainer>
      <FarmingLabel>Farming</FarmingLabel>
      <FarmPoolName>
        <FarmListItemImageWrapper>
          <img className={"smaller"} src={getTokenLogoURL("WXDC")} alt={"WXDC"} />
          <img className={"bigger"} src={getTokenLogoURL("FXD")} alt={"FXD"} />
        </FarmListItemImageWrapper>
        <FarmInfo>
          <FarmTitle>
            XDC - FXD
            <FarmDescription>LP</FarmDescription>
          </FarmTitle>
        </FarmInfo>
      </FarmPoolName>
      <ListItemWrapper>
        <FarmListLabel>
          Fee
        </FarmListLabel>
        <FarmListValue>
          <FarmPercent>2.4%</FarmPercent>
        </FarmListValue>
      </ListItemWrapper>
      <ListItemWrapper>
        <FarmListLabel>Earned</FarmListLabel>
        <FarmListValue>0</FarmListValue>
      </ListItemWrapper>
      <ListItemWrapper>
        <FarmListLabel>Apr</FarmListLabel>
        <FarmListValue>
          20%
        </FarmListValue>
      </ListItemWrapper>
      {/*<FarmItemInfoWrapper>*/}
      {/*  <FarmListItemFarmInfo isMobile={isMobile} />*/}
      {/*</FarmItemInfoWrapper>*/}

      <FarmItemInfoWrapper className={'mb-0'}>
        <FarmListItemEarned isMobile={isMobile} />
      </FarmItemInfoWrapper>

      <FarmItemInfoWrapper className={'mt-3'}>
        <FarmListItemFarmingDetails isMobile={isMobile} onOpen={() => setManageFarm(true)} />
      </FarmItemInfoWrapper>

      <FarmListItemMobileAdditionalData />
      <ExtendedBtnWrapper>
        <ExtendedBtn className={extended ? "visible" : "hidden"} onClick={() => setExtended(!extended)}>
          <img src={DirectionUp} alt={"direction-up"} />
        </ExtendedBtn>
        <ExtendedBtn className={!extended ? "visible" : "hidden"} onClick={() => setExtended(!extended)}>
          <img src={DirectionDown} alt={"direction-down"} />
        </ExtendedBtn>
      </ExtendedBtnWrapper>
      { manageFarm && <FarmListItemManageModal
        isMobile={isMobile}
        onClose={() => setManageFarm(false)}
        onFinish={() => {}}
      /> }
    </FarmListItemMobileContainer>
  );
};

export default FarmListItemMobile;