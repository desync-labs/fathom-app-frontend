import { ReactComponent as FxdSrc } from "assets/svg/icons/fxd.svg";
import { ReactComponent as SwapIconSrc } from "assets/svg/icons/stable-swap.svg";
import { ReactComponent as StakingIconSrc } from "assets/svg/icons/staking.svg";
import { ReactComponent as GovernanceSrc } from "assets/svg/icons/dao.svg";
import { ReactComponent as VaultSrc } from "assets/svg/icons/vault.svg";
import { ReactComponent as DexSrc } from "assets/svg/icons/dex.svg";
import { ReactComponent as SwapSrc } from "assets/svg/icons/swap.svg";
import { ReactComponent as PoolSrc } from "assets/svg/icons/pool.svg";
import { ReactComponent as TransactionsSrc } from "assets/svg/icons/bill.svg";
import { ReactComponent as ChartsSrc } from "assets/svg/icons/charts.svg";
import { ReactComponent as OverviewSrc } from "assets/svg/icons/overview.svg";
import { ReactComponent as TokensSrc } from "assets/svg/icons/tokens.svg";
import { ReactComponent as PairsSrc } from "assets/svg/icons/pairs.svg";
import { ReactComponent as AccountsSrc } from "assets/svg/icons/account.svg";
import { ReactComponent as LendingSrc } from "assets/svg/icons/lending.svg";
import { ReactComponent as DashboardSrc } from "assets/svg/icons/dashboard.svg";
import { ReactComponent as MarketsSrc } from "assets/svg/icons/markets.svg";
import { ReactComponent as VaultManagementSrc } from "assets/svg/icons/vault-management.svg";
import { ReactComponent as TutorialSrc } from "assets/svg/icons/tutorial.svg";

import { styled } from "@mui/material/styles";

const ACTIVE_HEX = "#43FFF1";
const INACTIVE_HEX = "#6379A1";

export const VaultManagement = styled(VaultManagementSrc)<{ isactive: string }>`
  & path {
    fill: ${({ isactive }) => (isactive ? ACTIVE_HEX : INACTIVE_HEX)};
  }
`;

export const TutorialIcon = styled(TutorialSrc)<{ isactive: string }>`
  & path {
    fill: ${({ isactive }) => (isactive ? ACTIVE_HEX : INACTIVE_HEX)};
  }
`;

export const FxdIcon = styled(FxdSrc)<{ isactive: string }>`
  & path {
    fill: ${({ isactive }) => (isactive ? ACTIVE_HEX : INACTIVE_HEX)};
  }
`;

export const StableSwapIcon = styled(SwapIconSrc)<{ isactive: string }>`
  & path {
    fill: ${({ isactive }) => (isactive ? ACTIVE_HEX : INACTIVE_HEX)};
  }
`;

export const StakingIcon = styled(StakingIconSrc)<{ isactive: string }>`
  & path {
    fill: ${({ isactive }) => (isactive ? ACTIVE_HEX : INACTIVE_HEX)};
  }
`;

export const GovernanceIcon = styled(GovernanceSrc)<{ isactive: string }>`
  & path {
    fill: ${({ isactive }) => (isactive ? ACTIVE_HEX : INACTIVE_HEX)};
  }
`;

export const VaultIcon = styled(VaultSrc)<{ isactive: string }>`
  & path {
    fill: ${({ isactive }) => (isactive ? ACTIVE_HEX : INACTIVE_HEX)};
  }
`;

export const DexIcon = styled(DexSrc)<{ isactive: string }>`
  & path {
    fill: ${({ isactive }) => (isactive ? ACTIVE_HEX : INACTIVE_HEX)};
  }
`;

export const SwapIcon = styled(SwapSrc)<{ isactive: string }>`
  & path {
    fill: ${({ isactive }) => (isactive ? ACTIVE_HEX : INACTIVE_HEX)};
  }
`;

export const PoolIcon = styled(PoolSrc)<{ isactive: string }>`
  & path {
    fill: ${({ isactive }) => (isactive ? ACTIVE_HEX : INACTIVE_HEX)};
  }
`;

export const TransactionsIcon = styled(TransactionsSrc)<{ isactive: string }>`
  & path {
    fill: ${({ isactive }) => (isactive ? ACTIVE_HEX : INACTIVE_HEX)};
  }
`;

export const ChartsIcon = styled(ChartsSrc)<{ isactive: string }>`
  & path {
    fill: ${({ isactive }) => (isactive ? ACTIVE_HEX : INACTIVE_HEX)};
  }
`;

export const OverviewIcon = styled(OverviewSrc)<{ isactive: string }>`
  & path {
    fill: ${({ isactive }) => (isactive ? ACTIVE_HEX : INACTIVE_HEX)};
  }
`;

export const TokensIcon = styled(TokensSrc)<{ isactive: string }>`
  & path {
    fill: ${({ isactive }) => (isactive ? ACTIVE_HEX : INACTIVE_HEX)};
  }
`;

export const PairsIcon = styled(PairsSrc)<{ isactive: string }>`
  & path {
    fill: ${({ isactive }) => (isactive ? ACTIVE_HEX : INACTIVE_HEX)};
  }
`;

export const AccountsIcon = styled(AccountsSrc)<{ isactive: string }>`
  & path {
    fill: ${({ isactive }) => (isactive ? ACTIVE_HEX : INACTIVE_HEX)};
  }
`;

export const LendingIcon = styled(LendingSrc)<{ isactive: string }>`
  & path {
    fill: ${({ isactive }) => (isactive ? ACTIVE_HEX : INACTIVE_HEX)};
  }
`;

export const DashboardIcon = styled(DashboardSrc)<{ isactive: string }>`
  & path {
    fill: ${({ isactive }) => (isactive ? ACTIVE_HEX : INACTIVE_HEX)};
  }
`;

export const MarketsIcon = styled(MarketsSrc)<{ isactive: string }>`
  & path {
    fill: ${({ isactive }) => (isactive ? ACTIVE_HEX : INACTIVE_HEX)};
  }
`;
