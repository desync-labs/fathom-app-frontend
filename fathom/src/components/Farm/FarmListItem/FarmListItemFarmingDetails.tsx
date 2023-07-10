import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { getTokenLogoURL } from "utils/tokenLogo";
import {
  Approx,
  Apr,
  FarmInfoStats,
  Tokens,
  Token
} from "components/Farm/FarmListItem/FarmListItemFarmInfo";
import {
  ButtonSecondary
} from "components/AppComponents/AppButton/AppButton";
import { FC } from "react";


const FarmTitle = styled("div")`
  color: #5A81FF;
  font-size: 15px;
  font-weight: 600;
  line-height: 20px;
`;

const FarmInfo = styled("div")`
  display: flex;
  gap: 40px;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 20px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    display: block;
  }
`;

const TotalTokens = styled("div")`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  line-height: 20px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    justify-content: space-between;
    margin-bottom: 5px;
  }
`;

const Pooled = styled("div")`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  line-height: 20px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    justify-content: space-between;
    margin-bottom: 5px;
  }
`;

const PoolShare = styled("div")`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  line-height: 20px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    justify-content: space-between;
    margin-bottom: 5px;
  }
`;

const ManageFarmBtnWrapper = styled("div")`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-top: 40px;
    height: auto;
  }
`;

const ManageFarmBtn = styled(ButtonSecondary)`
  width: 100%;
  height: 40px;
`;

type FarmListItemFarmingDetailsProps = {
  isMobile: boolean;
  onOpen: () => void;
}

const FarmListItemFarmingDetails: FC<FarmListItemFarmingDetailsProps> = ({ isMobile, onOpen }) => {
  return (
    <Grid container>
      <Grid item xs={isMobile ? 12 : 10}>
        <FarmTitle>USDT - XDC LP #1245655</FarmTitle>
        <FarmInfo>
          <TotalTokens>
            Your total pool tokens: <span>8.69507</span>
          </TotalTokens>
          <Pooled>
            Pooled USDT:
            <Token>
              <img src={getTokenLogoURL("xUSDT")} width={20} height={20} alt={'token img'} />
              12.00
            </Token>
          </Pooled>
          <Pooled>
            Pooled XDC:
            <Token>
              <img src={getTokenLogoURL("WXDC")} width={20} height={20} alt={'token img'} />
              12.00
            </Token>
          </Pooled>
          <PoolShare>
            Your pool share: <span>29%</span>
          </PoolShare>
        </FarmInfo>
        { isMobile && <Apr>
          Apr
          <span>
              9.40%
            </span>
        </Apr> }
        <FarmInfoStats>
          { !isMobile && <Apr>
            Apr
            <span>
              9.40%
            </span>
          </Apr> }
          <Approx>
            ~295.95 USDs
          </Approx>
          <Tokens>
            <Token>
              <img src={getTokenLogoURL("xUSDT")} width={20} height={20} alt={'token img'} />
              12.00
            </Token>
            <Token>
              <img src={getTokenLogoURL("WXDC")} width={20} height={20} alt={'token img'} />
              12.00
            </Token>
          </Tokens>
        </FarmInfoStats>
      </Grid>
      <Grid item xs={ isMobile ? 12 : 2}>
        <ManageFarmBtnWrapper>
          <ManageFarmBtn onClick={onOpen}>
            Manage Farm
          </ManageFarmBtn>
        </ManageFarmBtnWrapper>
      </Grid>
    </Grid>
  );
};

export default FarmListItemFarmingDetails;