import { AppFlexBox } from "components/AppComponents/AppBox/AppBox";
import { Box, styled } from "@mui/material";

import { ReactComponent as DepositedIcon } from "assets/svg/icons/vault-stats-deposited.svg";
import { ReactComponent as EarnedIcon } from "assets/svg/icons/vault-stats-earning.svg";

const StatItemWrapper = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 80px;
  border-radius: 12px;
  background: #1e2f4c;
  padding: 20px 24px;
`;
const StatItemLabel = styled(Box)`
  color: #6d86b2;
  font-size: 20px;
  font-weight: 600;
  line-height: 16px;
  text-transform: capitalize;
`;
const StatItemValue = styled(Box)`
  color: #fff;
  text-align: right;
  font-size: 24px;
  font-weight: 600;
  line-height: 24px;
`;

const StatItem = ({ title, value, icon }) => {
  return (
    <StatItemWrapper>
      <AppFlexBox sx={{ gap: 2 }}>
        {icon}
        <StatItemLabel>{title}</StatItemLabel>
      </AppFlexBox>
      <StatItemValue>{value}</StatItemValue>
    </StatItemWrapper>
  );
};

const VaultsTotalStats = () => {
  return (
    <AppFlexBox sx={{ gap: "16px", padding: "40px 0" }}>
      <StatItem title="Deposited" value="$12.99" icon={<DepositedIcon />} />
      <StatItem title="Earnings" value="$12.99" icon={<EarnedIcon />} />
    </AppFlexBox>
  );
};

export default VaultsTotalStats;
