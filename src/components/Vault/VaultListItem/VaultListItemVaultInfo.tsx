import { InfoWrapper } from "components/Vault/VaultListItem/VaultListItemPairInfo";
import { styled } from "@mui/material/styles";
import { FarmInfoFarmNowBtn } from "components/AppComponents/AppButton/AppButton";
import { getTokenLogoURL } from "utils/tokenLogo";
import { FC } from "react";

const LeftColumn = styled("div")`
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
  }
`;

const RightColumn = styled("div")`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 12px;
`;

export const FoundPosition = styled("div")`
  text-align: center;
  font-size: 14px;
  color: #fff;
  text-align: center;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-top: 40px;
  }
`;

const VaultInfoTitle = styled("div")`
  font-size: 15px;
  font-weight: 600;
  line-height: 20px;
  color: #5a81ff;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    margin-bottom: 15px;
  }
`;

export const VaultInfoStats = styled("div")`
  display: flex;
  gap: 20px;
  align-items: center;
`;

export const Apr = styled("div")`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  text-transform: uppercase;
  color: #fff;

  span {
    font-weight: normal;
    text-transform: none;
    font-size: 14px;
    line-height: 20px;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
  }
`;

export const Approx = styled("div")`
  font-size: 14px;
  line-height: 20px;
  color: #8ea4cc;
`;

export const Tokens = styled("div")`
  display: flex;
  gap: 12px;
`;

export const Token = styled("div")`
  display: flex;
  align-items: center;
  gap: 8px;
`;

type FarmListItemFarmInfoProps = {
  isMobile: boolean;
};

const VaultListItemVaultInfo: FC<FarmListItemFarmInfoProps> = ({
  isMobile,
}) => {
  return (
    <InfoWrapper>
      <LeftColumn>
        <VaultInfoTitle>USDT</VaultInfoTitle>
        {isMobile && (
          <Apr>
            Apr
            <span>9.40%</span>
          </Apr>
        )}
        <VaultInfoStats>
          {!isMobile && (
            <Apr>
              Apr
              <span>9.40%</span>
            </Apr>
          )}
          <Approx>~295.95 USDs</Approx>
          <Tokens>
            <Token>
              <img
                src={getTokenLogoURL("xUSDT")}
                width={20}
                height={20}
                alt={"token img"}
              />
              12.00
            </Token>
          </Tokens>
        </VaultInfoStats>
      </LeftColumn>
      <RightColumn>
        <FoundPosition>Deposit 12 USDT</FoundPosition>
        <FarmInfoFarmNowBtn>Lock Now</FarmInfoFarmNowBtn>
      </RightColumn>
    </InfoWrapper>
  );
};

export default VaultListItemVaultInfo;
