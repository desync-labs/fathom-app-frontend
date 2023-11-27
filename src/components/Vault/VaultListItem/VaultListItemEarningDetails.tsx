import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { getTokenLogoURL } from "utils/tokenLogo";
import {
  Approx,
  Apr,
  VaultInfoStats,
  Tokens,
  Token,
} from "components/Vault/VaultListItem/VaultListItemVaultInfo";
import { ButtonSecondary } from "components/AppComponents/AppButton/AppButton";
import { FC } from "react";

const VaultTitle = styled("div")`
  color: #5a81ff;
  font-size: 15px;
  font-weight: 600;
  line-height: 20px;
`;

const VaultInfo = styled("div")`
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

const ManageVaultBtnWrapper = styled("div")`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-top: 40px;
    height: auto;
  }
`;

const ManageVaultBtn = styled(ButtonSecondary)`
  width: 100%;
  height: 40px;
`;

type VaultListItemFarmingDetailsProps = {
  isMobile: boolean;
  onOpen: () => void;
};

const VaultListItemEarningDetails: FC<VaultListItemFarmingDetailsProps> = ({
  isMobile,
  onOpen,
}) => {
  return (
    <Grid container>
      <Grid item xs={isMobile ? 12 : 10}>
        <VaultTitle>USDT</VaultTitle>
        <VaultInfo>
          <TotalTokens>
            Your total share tokens: <span>8.69507</span>
          </TotalTokens>
          <Pooled>
            Pooled USDT:
            <Token>
              <img
                src={getTokenLogoURL("xUSDT")}
                width={20}
                height={20}
                alt={"token img"}
              />
              12.00
            </Token>
          </Pooled>
          <PoolShare>
            Your pool share: <span>29%</span>
          </PoolShare>
        </VaultInfo>
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
      </Grid>
      <Grid item xs={isMobile ? 12 : 2}>
        <ManageVaultBtnWrapper>
          <ManageVaultBtn onClick={onOpen}>Manage Vault</ManageVaultBtn>
        </ManageVaultBtnWrapper>
      </Grid>
    </Grid>
  );
};

export default VaultListItemEarningDetails;
