import { styled } from "@mui/material/styles";
import { Typography, Box as MuiBox, Box, Container } from "@mui/material";

import RemoveCircle from "assets/svg/remove-circle.svg";
import { Link } from "react-router-dom";

export const TitleSecondary = styled(Typography)`
  font-size: 16px;
  color: #fff;
  font-weight: bold;
  line-height: 24px;
  margin-bottom: 10px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-bottom: 15px;
  }
`;

export const NoResults = styled(Typography)`
  font-weight: 500;
  color: #6379a1;
  font-size: 14px;
  line-height: 20px;
  padding: 8px 10px;
  border-radius: 8px;
`;

export const Summary = styled(Typography)`
  color: #b7c8e5;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 15px;
`;

export const SummaryVaultFormInfo = styled(Summary)`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 14px;
  }
`;

export const WalletBalance = styled(Typography)`
  font-size: 12px;
  line-height: 16px;
  color: #6379a1;
  float: right;
`;
export const VaultWalletBalance = styled(WalletBalance)`
  color: #43fff1;
  text-align: end;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 11px;
  }
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

export const TVL = styled(Typography)`
  font-size: 12px;
  color: #6379a1;
  line-height: 16px;
  text-align: left;
`;

export const ErrorBox = styled(MuiBox)`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: rgba(51, 13, 13, 0.9);
  border: 1px solid #5a0000;
  border-radius: 8px;
  padding: 12px 16px;
  margin: 20px 0;

  svg {
    width: 20px;
    height: 20px;
    color: #f04242;
    float: left;
    margin-right: 10px;
  }
  p {
    color: #f76e6e;
    font-size: 14px;
    width: 100%;
    white-space: break-spaces;
  }
  a {
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const ErrorMessage = styled(Typography)`
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
  margin-right: 10px;
`;

export const WrongNetworkMobile = styled(MuiBox)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
`;

export const WrongNetworkMobileIcon = styled(MuiBox)`
  background: url("${RemoveCircle}") no-repeat center;
  width: 20px;
  height: 20px;
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
  ${({ theme }) => theme.breakpoints.down("sm")} {
    background: none;
    gap: 4px;
    margin-right: 0;
  }
`;

export const MainBox = styled(MuiBox)`
  background: linear-gradient(180deg, #071126 0%, #050c1a 100%);
  min-height: calc(var(--vh, 1vh) * 100);
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`;

export const WarningBox = styled(Box)`
  background: #452508;
  border: 1px solid #5c310a;
  border-radius: 8px;
  padding: 8px 16px;
  gap: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px 0 20px;

  svg {
    color: #f7b06e;
  }

  p {
    color: #f7b06e;
    font-size: 14px;
    width: 100%;
    white-space: break-spaces;
  }
  a {
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const InfoBox = styled(Box)`
  background: #132340;
  border-radius: 8px;
  padding: 8px 16px;
  gap: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px 0 20px;

  svg {
    height: 20px;
    width: 20px;
    color: #6379a1;
  }

  p {
    color: #b7c8e5;
    font-size: 14px;
    width: 100%;
    white-space: break-spaces;
  }
  a {
    &:hover {
      text-decoration: underline;
    }
  }
`;
export const InfoBoxV2 = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  padding-top: 20px;

  svg {
    height: 20px;
    width: 20px;
    color: #b7c8e5;
    margin: 0;
  }

  p {
    color: #b7c8e5;
    font-size: 14px;
    width: 100%;
    white-space: break-spaces;
  }
  a {
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const SuccessBox = styled(Box)`
  background: #173d0f;
  border: 1px solid #1f5214;
  border-radius: 8px;
  padding: 8px 16px;
  gap: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px 0 20px;

  svg {
    color: #8af075;
  }

  p {
    color: #8af075;
    font-size: 14px;
  }
`;

export const NestedRouteNav = styled("nav")`
  height: 65px;
  width: 100%;
  border-bottom: 1.5px solid #1d2d49;
  display: flex;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    display: grid;
    height: auto;
    border: none;
    grid-template-columns: 1fr 1fr;
    a {
      width: 100%;
      height: 60px;
      border-bottom: 1.5px solid #1d2d49;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

export const NestedRouteLink = styled(Link)<{ span?: number }>`
  color: #9fadc6;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 100%;
  padding: 0 52px;
  font-weight: 600;
  font-size: 17px;

  &.active {
    color: #fff;
    border-bottom: 2px solid #00fff6;
    background: #132340;
  }

  span {
    margin-bottom: 5px;
  }
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 0;
    grid-column: span ${({ span }) => (span ? span : 1)};
  }
`;

export const NestedRouteContainer = styled(Container)`
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-top: 15px;
  }
`;

export const ModalDescription = styled(Typography)`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #ffffff;
  padding: 0 15px;
  margin-bottom: 20px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 0;
  }
`;

export const CircleWrapper = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AppFlexBox = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const EmptyVaultsWrapper = styled(Box)`
  width: 100%;
  background: rgb(19, 35, 64);
  border-radius: 12px;
  padding: 16px;
`;
