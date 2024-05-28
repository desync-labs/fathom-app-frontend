import { Box, styled } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { formatHashShorten } from "utils/format";
import { AppFlexBox } from "components/AppComponents/AppBox/AppBox";

const StatusBarWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 8px;
  background: #1e2f4d;
  margin-top: 24px;
  padding: 20px 24px;
`;

const StrategyName = styled("div")`
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  line-height: 32px;
`;

const StatusBoxStyled = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 6px;
  color: #8af075;
  font-size: 14px;
  font-weight: 600;
  background: rgba(79, 101, 140, 0.2);
  padding: 4px 8px;
`;

const StatusLabel = ({ strategyId }: { strategyId?: string }) => {
  return (
    <StatusBoxStyled>
      <CheckCircleRoundedIcon sx={{ width: "16px", height: "16px" }} />
      Active
    </StatusBoxStyled>
  );
};

const StrategyStatusBar = ({
  strategyId,
  strategyName,
}: {
  strategyId: string;
  strategyName: string;
}) => {
  return (
    <StatusBarWrapper>
      <AppFlexBox sx={{ justifyContent: "flex-start", gap: "12px" }}>
        <StrategyName>{`${strategyName} (${formatHashShorten(
          strategyId
        )})`}</StrategyName>
        <StatusLabel strategyId={strategyId} />
      </AppFlexBox>
    </StatusBarWrapper>
  );
};

export default StrategyStatusBar;
