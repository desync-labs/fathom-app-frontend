import { AppTableRow } from "components/AppComponents/AppTable/AppTable";
import {
  IconButton,
  TableCell
} from "@mui/material";
import { getTokenLogoURL } from "utils/tokenLogo";
import { styled } from "@mui/material/styles";

import useFarmListItem from "hooks/useFarmListItem";

import { FarmNowBtn } from "components/AppComponents/AppButton/AppButton";

import FarmListItemPairInfo from "components/Farm/FarmListItem/FarmListItemPairInfo";
import FarmListItemFarmInfo from "components/Farm/FarmListItem/FarmListItemFarmInfo";

import FarmListItemFarmingDetails from "components/Farm/FarmListItem/FarmListItemFarmingDetails";
import FarmListItemEarned from "components/Farm/FarmListItem/FarmListItemEarned";
import FarmListItemManageModal from "components/Farm/FarmListItem/FarmListItemManageModal";

import LockSrc from "assets/svg/lock.svg";
import DirectionDown from "assets/svg/direction-down.svg";
import DirectionUp from "assets/svg/direction-up.svg";
import lockAquaSrc from "assets/svg/lock-aqua.svg";

const FarmListItemPoolCell = styled(TableCell)`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const FarmListItemImageWrapper = styled("div")`
  display: flex;
  justify-content: left;
  img.bigger {
    border-radius: 16px;
    width: 36px;
    height: 36px;
    margin-left: -10px;
    margin-top: 10px;
  }

  img.smaller {
    width: 24px;
    height: 24px;
  }
  ${({ theme }) => theme.breakpoints.down("sm")} {
    img.smaller {
      width: 24px;
      height: 24px;
    }
    img.bigger {
      width: 24px;
      height: 24px;
      margin-top: 0;
    }
  }
`;

export const FarmInfo = styled("div")``;

export const FarmTitle = styled("div")`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const FarmDescription = styled("span")`
  color: #B7C8E5;
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
`;

export const FarmPercent = styled("div")`
  display: flex;
  padding: 4px 8px;
  color: #fff;
  font-size: 12px;
  border-radius: 6px;
  width: 32px;
  height: 20px;
  background: #3665FF;
  align-items: center;
  font-weight: bold;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 46px;
  }
`;

export const FarmEarned = styled("div")`
  line-height: 20px;
  font-size: 14px;
  color: #fff;
`;

export const FarmApr = styled("div")`
  color: #fff;
`;

export const FarmStackedLiquidity = styled("div")`
  color: #fff;
`;

export const FarmAvailable = styled("div")`
  &.blue {
    color: #6D86B2;
  }

  color: #fff;
`;

export const FarmStacked = styled("div")`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: #6D86B2;
  gap: 12px;

  .img-wrapper {
    background: #4F658C33;
    border-radius: 8px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const ExtendedBtn = styled(IconButton)`
  float: right;

  &:hover {
    background: none;
  }
  &.visible {
    display: flex;
  }
  &.hidden {
    display: none;
  }
`;

export const FarmItemInfoWrapper = styled("div")`
  background: #132340;
  border-radius: 8px;
  padding: 20px 32px;
  margin-bottom: 5px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 20px;
    margin: 16px 0;
    &.mb-0 {
      margin-bottom: 0;
    }
    &.mt-3 {
      margin-top: 3px;
    }
  }
`;

const FarmingLabel = styled("div")`
  background: rgba(0, 128, 118, 0.15);
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: #43FFF1;
  border-radius: 6px;
  height: 20px;
  width: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
`;

const FarmListItem = () => {
  const {
    isMobile,
    extended,
    manageFarm,
    setExtended,
    setManageFarm
  } = useFarmListItem();

  return (
    <>
      <AppTableRow className={!extended ? "border single" : undefined}>
        <FarmListItemPoolCell>
          <FarmListItemImageWrapper>
            <img className={"smaller"} src={getTokenLogoURL("WXDC")} alt={"WXDC"} />
            <img className={"bigger"} src={getTokenLogoURL("FXD")} alt={"FXD"} />
          </FarmListItemImageWrapper>
          <FarmInfo>
            <FarmingLabel>Farming</FarmingLabel>
            <FarmTitle>
              XDC - FXD
              <FarmDescription>LP</FarmDescription>
            </FarmTitle>
          </FarmInfo>
        </FarmListItemPoolCell>
        <TableCell>
          <FarmPercent>1%</FarmPercent>
        </TableCell>
        <TableCell>
          <FarmEarned>0</FarmEarned>
        </TableCell>
        <TableCell>
          <FarmApr>100%</FarmApr>
        </TableCell>
        <TableCell>
          <FarmStackedLiquidity>
            $103,048
          </FarmStackedLiquidity>
        </TableCell>
        <TableCell>
          <FarmAvailable className={"blue"}>
            0 LP
            <FarmNowBtn>
              <img src={lockAquaSrc} alt={"Aqua"} />
              Farm Now
            </FarmNowBtn>
          </FarmAvailable>
        </TableCell>
        <TableCell>
          <FarmStacked>
            <div className={"img-wrapper"}>
              <img src={LockSrc} alt={"locked"} width={20} height={20} />
            </div>
            0 LP
          </FarmStacked>
        </TableCell>
        <TableCell>
          <ExtendedBtn className={ extended ? 'visible': 'hidden' } onClick={() => setExtended(!extended)}>
            <img src={DirectionUp} alt={"direction-up"} />
          </ExtendedBtn>
          <ExtendedBtn className={ !extended ? 'visible' : 'hidden' } onClick={() => setExtended(!extended)}>
            <img src={DirectionDown} alt={"direction-down"} />
          </ExtendedBtn>
        </TableCell>
      </AppTableRow>
      {extended && <AppTableRow className={"border"}>
        <TableCell colSpan={8} sx={{ paddingBottom: "15px !important" }}>
          <FarmItemInfoWrapper>
            {/*<FarmListItemPairInfo />*/}
            {/*<FarmListItemFarmInfo isMobile={} />*/}
            <FarmListItemFarmingDetails isMobile={isMobile} onOpen={() => setManageFarm(true)} />
          </FarmItemInfoWrapper>
          <FarmItemInfoWrapper>
            <FarmListItemEarned isMobile={isMobile} />
          </FarmItemInfoWrapper>
        </TableCell>
      </AppTableRow>}
      { manageFarm && <FarmListItemManageModal
        isMobile={isMobile}
        onClose={() => setManageFarm(false)}
        onFinish={() => {}}
      /> }
    </>
  );
};

export default FarmListItem;