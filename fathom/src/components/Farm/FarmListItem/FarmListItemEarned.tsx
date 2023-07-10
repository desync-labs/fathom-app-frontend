import React, { FC } from "react";
import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import AppPopover from "components/AppComponents/AppPopover/AppPopover";
import {
  ButtonPrimary
} from "components/AppComponents/AppButton/AppButton";

const TokenName = styled("div")`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;

  span {
    font-weight: normal;
    color: #8EA4CC;
    font-size: 14px;
    line-height: 20px;
  }
`;

const TokenValue = styled("div")`
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 7px;
  color: #fff;
  font-size: 24px;
  font-weight: 600;
  line-height: 28px;

  span {
    font-weight: normal;
    color: #8EA4CC;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.14px;
  }
`;

const CollectBtnWrapper = styled("div")`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-top: 40px;
    height: 40px;
  }
`;

const CollectBtn = styled(ButtonPrimary)`
  width: 100%;
  height: 40px;
`;

type FarmListItemEarnedProps = {
  isMobile: boolean
}

const FarmListItemEarned: FC<FarmListItemEarnedProps> = ({ isMobile }) => {
  return (
    <Grid container>
      <Grid item xs={isMobile ? 12 : 3}>
        <TokenName>
          USDT <span>Earned</span>
          <AppPopover id={"earned"}
                      text={<>
                        Earned
                      </>} />
        </TokenName>
        <TokenValue>
          0.012 <span>$0.0123456</span>
        </TokenValue>
      </Grid>
      { !isMobile && <Grid item xs={7}></Grid> }
      <Grid item xs={isMobile ? 12 : 2}>
        <CollectBtnWrapper>
          <CollectBtn>
            Collect
          </CollectBtn>
        </CollectBtnWrapper>
      </Grid>
    </Grid>
  );
};

export default FarmListItemEarned;