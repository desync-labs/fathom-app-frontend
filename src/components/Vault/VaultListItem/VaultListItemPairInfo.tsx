import { styled } from "@mui/material/styles";
import { AddLiquidityBtn } from "components/AppComponents/AppButton/AppButton";

import rightUpAquaSrc from "assets/svg/right-up-aqua.svg";
import contractSrc from "assets/svg/contract.svg";
import plusSrc from "assets/svg/plus.svg";

export const InfoWrapper = styled("div")`
  display: flex;
  justify-content: space-between;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    display: block;
  }
`;

const LeftColumn = styled("div")`
  a:last-of-type {
    padding-bottom: 0;
  }
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-bottom: 20px;
  }
`;

const RightColumn = styled("div")`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const InfoLink = styled("a")`
  font-size: 15px;
  color: #43fff1;
  font-weight: 600;
  line-height: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 8px;
`;

export const NoPosition = styled("div")`
  text-align: center;
`;

const VaultListItemPairInfo = () => {
  return (
    <InfoWrapper>
      <LeftColumn>
        <InfoLink>Add XDC - FXD LP</InfoLink>
        <InfoLink>
          Pair Info <img src={rightUpAquaSrc} alt={"right-up"} />
        </InfoLink>
        <InfoLink>
          Contract <img src={contractSrc} alt={"contract"} />{" "}
        </InfoLink>
      </LeftColumn>
      <RightColumn>
        <NoPosition>No position found</NoPosition>
        <AddLiquidityBtn>
          <img src={plusSrc} alt={"plus"} />
          Add Liquidity
        </AddLiquidityBtn>
      </RightColumn>
    </InfoWrapper>
  );
};

export default VaultListItemPairInfo;
