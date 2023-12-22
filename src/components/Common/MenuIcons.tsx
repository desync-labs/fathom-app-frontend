import { ReactComponent as FxdSrc } from "assets/svg/icons/fxd.svg";
import { ReactComponent as SwapIconSrc } from "assets/svg/icons/stable-swap.svg";
import { ReactComponent as StakingIconSrc } from "assets/svg/icons/staking.svg";
import { ReactComponent as GovernanceSrc } from "assets/svg/icons/governance.svg";
import { ReactComponent as VaultSrc } from "assets/svg/icons/vault.svg";
import { ReactComponent as DexSrc } from "assets/svg/icons/dex.svg";
import { ReactComponent as SwapSrc } from "assets/svg/icons/swap.svg";
import { ReactComponent as PoolSrc } from "assets/svg/icons/pool.svg";
import { ReactComponent as ChartsSrc } from "assets/svg/icons/charts.svg";
import { ReactComponent as OverviewSrc } from "assets/svg/icons/overview.svg";
import { ReactComponent as TokensSrc } from "assets/svg/icons/tokens.svg";
import { ReactComponent as PairsSrc } from "assets/svg/icons/pairs.svg";
import { ReactComponent as AccountsSrc } from "assets/svg/icons/account.svg";

import { styled } from "@mui/material/styles";

export const FxdIcon = styled(FxdSrc)<{ isactive: string }>`
  & path {
    fill: ${({ isactive }) => (isactive ? "#43FFF1" : "#6379A1")};
  }
`;

export const StableSwapIcon = styled(SwapIconSrc)<{ isactive: string }>`
  margin-top: -3px;
  & path {
    fill: ${({ isactive }) => (isactive ? "#43FFF1" : "#6379A1")};
  }
`;

export const StakingIcon = styled(StakingIconSrc)<{ isactive: string }>`
  margin-top: -3px;
  & path {
    fill: ${({ isactive }) => (isactive ? "#43FFF1" : "#6379A1")};
  }
`;

export const GovernanceIcon = styled(GovernanceSrc)<{ isactive: string }>`
  margin-top: 2px;
  & path {
    fill: ${({ isactive }) => (isactive ? "#43FFF1" : "#6379A1")};
  }
`;

export const VaultIcon = styled(VaultSrc)<{ isactive: string }>`
  & path {
    fill: ${({ isactive }) => (isactive ? "#43FFF1" : "#6379A1")};
  }
`;

export const DexIcon = styled(DexSrc)<{ isactive: string }>`
  & path {
    fill: ${({ isactive }) => (isactive ? "#43FFF1" : "#6379A1")};
  }
`;

export const SwapIcon = styled(SwapSrc)<{ isactive: string }>`
  & path {
    fill: ${({ isactive }) => (isactive ? "#43FFF1" : "#6379A1")};
  }
`;

export const PoolIcon = styled(PoolSrc)<{ isactive: string }>`
  & path {
    fill: ${({ isactive }) => (isactive ? "#43FFF1" : "#6379A1")};
  }
`;

export const ChartsIcon = styled(ChartsSrc)<{ isactive: string }>`
  & path {
    fill: ${({ isactive }) => (isactive ? "#43FFF1" : "#6379A1")};
  }
`;

export const OverviewIcon = styled(OverviewSrc)<{ isactive: string }>`
  & path {
    fill: ${({ isactive }) => (isactive ? "#43FFF1" : "#6379A1")};
  }
`;

export const TokensIcon = styled(TokensSrc)<{ isactive: string }>`
  & path {
    fill: ${({ isactive }) => (isactive ? "#43FFF1" : "#6379A1")};
  }
`;

export const PairsIcon = styled(PairsSrc)<{ isactive: string }>`
  & path {
    fill: ${({ isactive }) => (isactive ? "#43FFF1" : "#6379A1")};
  }
`;

export const AccountsIcon = styled(AccountsSrc)<{ isactive: string }>`
  & path {
    fill: ${({ isactive }) => (isactive ? "#43FFF1" : "#6379A1")};
  }
`;
