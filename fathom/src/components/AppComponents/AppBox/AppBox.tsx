import { styled } from "@mui/material/styles";
import { Typography, Box as MuiBox } from "@mui/material";

export const TitleSecondary = styled(Typography)`
  font-size: 16px;
  color: #fff;
  font-weight: bold;
  line-height: 24px;
  margin-bottom: 10px;
`;

export const Adjust = styled(Typography)`
  font-size: 13px;
  font-weight: bold;
  padding-top: 7px;
  margin-left: -10px;
  color: #43fff1;
`;

export const NoResults = styled(Typography)`
  margin: 0;
  font-weight: 500;
  color: #6379a1;
  font-size: 14px;
  line-height: 20px;
  border-bottom: 1px solid #131f35;
  padding: 8px 10px;
  background: #131F35;
  border-radius: 8px;
`;

export const Summary = styled(Typography)`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 15px;
`;
export const WalletBalance = styled(Typography)`
  font-size: 12px;
  line-height: 16px;
  color: #6379a1;
  float: right;
`;

export const ErrorMessage = styled(Typography)`
  fon-size: 14px;
`;

export const InfoLabel = styled(Typography)`
  font-size: 14px;
  float: left;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const InfoValue = styled(Typography)`
  font-size: 14px;
  color: #fff;
  float: right;
`;

export const InfoWrapper = styled(MuiBox)`
  overflow: hidden;
  padding: 2px 0;
`;

export const ApproveBox = styled(MuiBox)`
  background: #131f35;
  border-radius: 8px;
  padding: 12px 16px 20px;
  gap: 12px;
  margin-top: 20px;
`;

export const ApproveBoxTypography = styled(Typography)`
  font-size: 14px;
  line-height: 20px;
  color: #9fadc6;
`;

export const PoolName = styled(Typography)`
  font-size: 14px;
  color: #fff;
  text-align: left;
  line-height: 20px;
`;

export const Fee = styled(Typography)`
  font-size: 12px;
  color: #6379a1;
  line-height: 16px;
`;

export const ClosePositionError = styled(MuiBox)`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  background: rgba(51, 13, 13, 0.9);
  border: 1px solid #5a0000;
  border-radius: 8px;
  padding: 12px 16px 20px;
  margin: 20px 0;
`;

export const ClosePositionErrorMessage = styled(Typography)`
  font-size: 14px;
  line-height: 20px;
  color: #ff8585;
`;

export const WrongNetwork = styled(MuiBox)`
  display: flex;
  align-items: center;
  background: #6c1313;
  border: 1px solid #811717;
  border-radius: 8px;
  color: #ffffff;
  font-weight: bold;
  font-size: 13px;
  cursor: pointer;
  padding: 4px 12px;
`;

export const RightNetwork = styled(MuiBox)`
  background: #253656;
  border-radius: 8px;
  margin-right: 10px;
  justify-content: center;
  align-items: center;
  display: flex;
  gap: 8px;
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  padding: 4px 8px;
  cursor: pointer;
`

export const MainBox = styled(MuiBox)`
  background: linear-gradient(180deg, #071126 0%, #050c1a 100%);
  flex-grow: 1;
  height: 100vh;
  overflow: auto;
`;
