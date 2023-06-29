import { AppTableRow } from "components/AppComponents/AppTable/AppTable";
import {
  IconButton,
  TableCell
} from "@mui/material";
import { getTokenLogoURL } from "utils/tokenLogo";
import { styled } from "@mui/material/styles";

import useFarmListItem from "hooks/useFarmListItem";

import LockSrc from "assets/svg/lock.svg";
import DirectionDown from "assets/svg/direction-down.svg";
import DirectionUp from "assets/svg/direction-up.svg";
import { FarmNowBtn } from "components/AppComponents/AppButton/AppButton";

import lockAquaSrc from 'assets/svg/lock-aqua.svg'
import FarmListItemPairInfo from "./FarmListItem/FarmListItemPairInfo";

const FarmListItemPoolCell = styled(TableCell)`
  display: flex;
  align-items: center;
  gap: 20px;

  img.bigger {
    border-radius: 16px;
    width: 32px;
    height: 32px;
    margin-left: -10px;
    margin-top: 10px;
  }

  img.smaller {
    width: 24px;
    height: 24px;
  }
`;

const FarmListItemImageWrapper = styled("div")`
  display: flex;
  justify-content: left;
`;

const FarmInfo = styled("div")``;

const FarmTitle = styled("div")`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
`;

const FarmDescription = styled("div")`
  color: #9FADC6;
  font-size: 14px;
  line-height: 20px;
`;

const FarmPercent = styled("div")`
  display: flex;
  padding: 4px 8px;
  color: #fff;
  border-radius: 6px;
  width: 32px;
  height: 20px;
  background: #3665FF;
  align-items: center;
  font-weight: bold;
`;

const FarmEarned = styled("div")`
  line-height: 20px;
  font-size: 14px;
  color: #fff;
`;

const FarmApr = styled("div")`
  color: #fff;
`;
const FarmStackedLiquidity = styled("div")`
  color: #fff;
`;

const FarmAvailable = styled("div")`
  &.blue {
    color: #6D86B2;
  }

  color: #fff;
`;

const FarmStacked = styled("div")`
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

const ExtendedBtn = styled(IconButton)`
  float: right;

  &:hover {
    background: none;
  }
`;

const FarmItemInfoWrapper = styled('div')`
  background: #132340;
  border-radius: 8px;
  padding: 20px 32px;
  margin-bottom: 20px;
`


const FarmListItem = () => {
  const { extended, setExtended } = useFarmListItem();

  return (
    <>
      <AppTableRow className={!extended ? "border single" : undefined}>
        <FarmListItemPoolCell>
          <FarmListItemImageWrapper>
            <img className={"smaller"} src={getTokenLogoURL("WXDC")} alt={"WXDC"} />
            <img className={"bigger"} src={getTokenLogoURL("FXD")} alt={"FXD"} />
          </FarmListItemImageWrapper>
          <FarmInfo>
            <FarmTitle>XDC - FXD</FarmTitle>
            <FarmDescription>LP</FarmDescription>
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
              <img src={lockAquaSrc} alt={'Aqua'} />
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
          {extended && <ExtendedBtn onClick={() => setExtended(!extended)}>
            <img src={DirectionUp} alt={"direction-up"} />
          </ExtendedBtn>}
          {!extended && <ExtendedBtn onClick={() => setExtended(!extended)}>
            <img src={DirectionDown} alt={"direction-down"} />
          </ExtendedBtn>}
        </TableCell>
      </AppTableRow>
      {extended && <AppTableRow className={"border"}>
        <TableCell colSpan={8}>
          <FarmItemInfoWrapper>
            <FarmListItemPairInfo />
          </FarmItemInfoWrapper>
        </TableCell>
      </AppTableRow>}
    </>
  );
};

export default FarmListItem;