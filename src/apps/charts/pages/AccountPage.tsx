import {
  useState,
  useMemo,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
  FC,
  memo,
  MouseEvent,
} from "react";
import { Navigate, useParams } from "react-router-dom";
import { Box, Fade, Menu, styled, useMediaQuery } from "@mui/material";
import {
  useUserTransactions,
  useUserPositions,
} from "apps/charts/contexts/User";
import TxnList from "apps/charts/components/TxnList";
import Panel from "apps/charts/components/Panel";
import { formattedNum, isAddress } from "apps/charts/utils";
import Row, { AutoRow, RowFixed, RowBetween } from "apps/charts/components/Row";
import { AutoColumn } from "apps/charts/components/Column";
import UserChart from "apps/charts/components/UserChart";
import PairReturnsChart from "apps/charts/components/PairReturnsChart";
import PositionList from "apps/charts/components/PositionList";
import { TYPE } from "apps/charts/Theme";
import { ButtonDropdown } from "apps/charts/components/ButtonStyled";
import {
  PageWrapper,
  ContentWrapper,
  StyledIcon,
} from "apps/charts/components";
import DoubleTokenLogo from "apps/charts/components/DoubleLogo";
import Link from "apps/charts/components/Link";
import { FEE_WARNING_TOKENS } from "apps/charts/constants";
import { BasicLink } from "apps/charts/components/Link";
import Search from "apps/charts/components/Search";
import { useSavedAccounts } from "apps/charts/contexts/LocalStorage";
import { TableHeaderBox } from "apps/charts/components/Row";
import { Position } from "apps/charts/utils/returns";
import { LayoutWrapper } from "apps/charts/App";

import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import useSharedContext from "context/shared";

const AccountWrapper = styled(Box)`
  background-color: transparent;
  padding: 6px 16px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DashboardWrapper = styled(Box)`
  width: 100%;
`;

const DropdownWrapper = styled(Box)`
  position: relative;
  margin-bottom: 1rem;
`;

const DropdownMenu = styled(Menu)<{ hide?: boolean }>`
  .MuiPaper-root {
    border: none !important;
    background: transparent !important;
    margin-top: 0 !important;
    border-radius: 0;
    max-width: unset;
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.04), 0 4px 8px rgba(0, 0, 0, 0.04),
      0 16px 24px rgba(0, 0, 0, 0.04), 0 24px 32px rgba(0, 0, 0, 0.04);
    @media screen and (max-width: 600px) {
      margin-left: -6px;
    }
  }
  .MuiList-root {
    border-radius: 0 0 8px 8px;
    border: 1px solid #3d5580;
    background: #091433;
  }
`;

const MenuRow = styled(Row)`
  width: 100%;
  padding: 12px 0 12px 12px;

  :hover {
    cursor: pointer;
    background-color: rgba(0, 255, 246, 0.16);
  }
`;

const PanelWrapper = styled(Box)`
  grid-template-columns: 1fr;
  grid-template-rows: max-content;
  gap: 6px;
  display: inline-grid;
  width: 100%;
  align-items: start;
`;

const Warning = styled(Box)`
  background-color: #2c2f36;
  color: #fafafa;
  padding: 1rem;
  font-weight: 600;
  border-radius: 10px;
  margin-bottom: 1rem;
  width: calc(100% - 2rem);
`;

const HeaderWrapper = styled(Box)`
  background: #2c4066;
  border-radius: 8px;
  font-size: 1.125rem;
  padding: 7px 1.125rem 7px;
  margin-top: 3rem;
  margin-bottom: 1rem;
`;

const AccountDetailsLayout = styled(Box)`
  display: inline-grid;
  width: calc(100% - 1.25rem);
  grid-template-columns: auto auto auto 1fr;
  gap: 75px;
  align-items: start;
  padding-left: 1.25rem;

  &:last-child {
    align-items: center;
    justify-items: end;
  }
  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
    align-items: stretch;
    > * {
      /* grid-column: 1 / 4; */
      margin-bottom: 1rem;
    }

    &:last-child {
      align-items: start;
      justify-items: start;
    }
  }
  @media screen and (max-width: 1000px) {
    gap: 0;
  }
`;

const ActivityIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  );
};

type AccountPageProps = { account: string };

const AccountPage: FC<AccountPageProps> = memo((props) => {
  const { account } = props;
  // get data for this account
  const transactions = useUserTransactions(account);
  const positions = useUserPositions(account);
  const { isMobile } = useSharedContext();

  // get data for user stats
  const transactionCount =
    transactions?.swaps?.length +
    transactions?.burns?.length +
    transactions?.mints?.length;

  // get derived totals
  const totalSwappedUSD = useMemo(() => {
    return transactions?.swaps
      ? transactions?.swaps.reduce(
          (total: number, swap: { amountUSD: string }) => {
            return total + parseFloat(swap.amountUSD);
          },
          0
        )
      : 0;
  }, [transactions]);

  // if any position has token from fee warning list, show warning
  const [showWarning, setShowWarning] = useState(false);
  useEffect(() => {
    if (positions) {
      for (let i = 0; i < positions.length; i++) {
        if (
          FEE_WARNING_TOKENS.includes(positions[i].pair.token0.id) ||
          FEE_WARNING_TOKENS.includes(positions[i].pair.token1.id)
        ) {
          setShowWarning(true);
        }
      }
    }
  }, [positions]);

  // settings for list view and dropdowns
  const hideLPContent = positions && positions.length === 0;
  const [activePosition, setActivePosition] = useState<Position | null>(null);
  const [anchorDropdown, setAnchorDropdown] = useState<null | HTMLElement>(
    null
  );
  const openDropdown = Boolean(anchorDropdown);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorDropdown(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorDropdown(null);
  };

  const dynamicPositions = activePosition ? [activePosition] : positions;

  const aggregateFees = dynamicPositions?.reduce(function (
    total: any,
    position: Position
  ) {
    return total + position.fees?.sum;
  },
  0);

  const positionValue = useMemo(() => {
    return dynamicPositions
      ? dynamicPositions.reduce(
          (
            total: number,
            position: {
              liquidityTokenBalance: string;
              pair: { totalSupply: string; reserveUSD: number };
            }
          ) => {
            return (
              total +
              (parseFloat(position?.liquidityTokenBalance) /
                parseFloat(position?.pair?.totalSupply)) *
                position?.pair?.reserveUSD
            );
          },
          0
        )
      : null;
  }, [dynamicPositions]);

  useEffect(() => {
    window.scrollTo({
      behavior: "smooth",
      top: 0,
    });
  }, []);

  const below600 = useMediaQuery("(max-width: 600px)");

  // adding/removing account from saved accounts
  const [savedAccounts, addAccount, removeAccount] = useSavedAccounts();
  const isBookmarked = savedAccounts.includes(account);
  const handleBookmarkClick = useCallback(() => {
    (isBookmarked ? removeAccount : addAccount)(account);
  }, [account, isBookmarked, addAccount, removeAccount]);

  return (
    <PageWrapper>
      <ContentWrapper>
        <RowBetween>
          <TYPE.body>
            <BasicLink to="/charts/accounts">{"Accounts "}</BasicLink>→{" "}
            <Link
              href={
                "https://xdc.blocksscan.io/address/" +
                account.replace(/^.{2}/g, "xdc")
              }
              external
            >
              {" "}
              {account?.slice(0, 42)}{" "}
            </Link>
          </TYPE.body>
          {!below600 && <Search small={true} />}
        </RowBetween>
        <Box>
          <RowBetween>
            <span>
              <TYPE.header fontSize={24}>
                {account?.slice(0, 6) + "..." + account?.slice(38, 42)}
              </TYPE.header>
              <Link
                href={
                  "https://xdc.blocksscan.io/address/" +
                  account.replace(/^.{2}/g, "xdc")
                }
                external
              >
                <TYPE.main fontSize={14}>View on BlocksScan</TYPE.main>
              </Link>
            </span>
            <AccountWrapper>
              <StyledIcon>
                <BookmarkBorderIcon
                  onClick={handleBookmarkClick}
                  style={{
                    width: "28px",
                    height: "28px",
                    opacity: isBookmarked ? 0.8 : 0.4,
                    cursor: "pointer",
                  }}
                />
              </StyledIcon>
            </AccountWrapper>
          </RowBetween>
        </Box>
        <DashboardWrapper>
          {showWarning && (
            <Warning>
              Fees cannot currently be calculated for pairs that include AMPL.
            </Warning>
          )}
          {!hideLPContent && (
            <DropdownWrapper>
              <ButtonDropdown
                open={openDropdown}
                width="100%"
                onClick={handleClick}
              >
                {activePosition ? (
                  <RowFixed>
                    <DoubleTokenLogo
                      a0={activePosition.pair?.token0.id}
                      a1={activePosition.pair?.token1.id}
                      size={16}
                    />
                    <TYPE.body ml={"16px"}>
                      {activePosition.pair?.token0.symbol}-
                      {activePosition.pair?.token1.symbol} Position
                    </TYPE.body>
                  </RowFixed>
                ) : (
                  <RowFixed>
                    <StyledIcon>
                      <ActivityIcon />
                    </StyledIcon>
                    <TYPE.body ml={"10px"}>All Positions</TYPE.body>
                  </RowFixed>
                )}
              </ButtonDropdown>
              <DropdownMenu
                anchorEl={anchorDropdown}
                open={openDropdown}
                keepMounted
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                  sx: { width: anchorDropdown && anchorDropdown.offsetWidth },
                }}
                TransitionComponent={Fade}
              >
                <AutoColumn gap="0px">
                  {positions?.map((p: any, i: any) => {
                    if (p.pair?.token1.symbol === "WXDC") {
                      p.pair.token1.symbol = "XDC";
                    }
                    if (p.pair?.token0.symbol === "WXDC") {
                      p.pair.token0.symbol = "XDC";
                    }
                    return (
                      p.pair?.id !== activePosition?.pair.id && (
                        <MenuRow
                          onClick={() => {
                            setActivePosition(p);
                            handleClose();
                          }}
                          key={i}
                        >
                          <DoubleTokenLogo
                            a0={p.pair?.token0.id}
                            a1={p.pair?.token1.id}
                            size={16}
                          />
                          <TYPE.body ml={"16px"}>
                            {p.pair?.token0.symbol}-{p.pair?.token1.symbol}{" "}
                            Position
                          </TYPE.body>
                        </MenuRow>
                      )
                    );
                  })}
                  {activePosition && (
                    <MenuRow
                      onClick={() => {
                        setActivePosition(null);
                        handleClose();
                      }}
                    >
                      <RowFixed>
                        <StyledIcon>
                          <ActivityIcon />
                        </StyledIcon>
                        <TYPE.body ml={"10px"}>All Positions</TYPE.body>
                      </RowFixed>
                    </MenuRow>
                  )}
                </AutoColumn>
              </DropdownMenu>
            </DropdownWrapper>
          )}
          {!hideLPContent && (
            <Panel style={{ height: "100%", marginBottom: "1rem" }}>
              <AutoRow gap="20px">
                <AutoColumn gap="10px">
                  <RowBetween>
                    <TYPE.body>Liquidity (Including Fees)</TYPE.body>
                    <div />
                  </RowBetween>
                  <RowFixed align="flex-end">
                    <TYPE.header fontSize={"24px"} lineHeight={1}>
                      {positionValue
                        ? formattedNum(positionValue, true)
                        : positionValue === 0
                        ? formattedNum(0, true)
                        : "-"}
                    </TYPE.header>
                  </RowFixed>
                </AutoColumn>
                <AutoColumn gap="10px">
                  <RowBetween>
                    <TYPE.body>Fees Earned (Cumulative)</TYPE.body>
                    <div />
                  </RowBetween>
                  <RowFixed align="flex-end">
                    <TYPE.header
                      fontSize={"24px"}
                      lineHeight={1}
                      color={aggregateFees && "green"}
                    >
                      {aggregateFees ? formattedNum(aggregateFees, true) : "-"}
                    </TYPE.header>
                  </RowFixed>
                </AutoColumn>
              </AutoRow>
            </Panel>
          )}
          {!hideLPContent && (
            <PanelWrapper>
              <Panel
                style={{
                  gridColumn: "1",
                  padding: isMobile ? "1.25rem 0 1.25rem 1.25rem" : "1.25rem",
                }}
              >
                {activePosition ? (
                  <PairReturnsChart
                    account={account}
                    position={activePosition}
                  />
                ) : (
                  <UserChart account={account} />
                )}
              </Panel>
            </PanelWrapper>
          )}
          <TYPE.main
            fontSize={"1.125rem"}
            style={{ marginTop: "3rem", marginBottom: "2rem" }}
          >
            Positions
          </TYPE.main>{" "}
          <PositionList positions={positions} />
          <TYPE.main
            fontSize={"1.125rem"}
            style={{ marginTop: "3rem", marginBottom: "2rem" }}
          >
            Transactions
          </TYPE.main>{" "}
          <TxnList transactions={transactions} />
          <HeaderWrapper>
            <TableHeaderBox>Wallet Stats</TableHeaderBox>
          </HeaderWrapper>{" "}
          <AccountDetailsLayout>
            <AutoColumn gap="8px">
              <TYPE.header>
                {totalSwappedUSD ? formattedNum(totalSwappedUSD, true) : "-"}
              </TYPE.header>
              <TYPE.main>Total Value Swapped</TYPE.main>
            </AutoColumn>
            <AutoColumn gap="8px">
              <TYPE.header>
                {totalSwappedUSD
                  ? formattedNum(totalSwappedUSD * 0.003, true)
                  : "-"}
              </TYPE.header>
              <TYPE.main>Total Fees Paid</TYPE.main>
            </AutoColumn>
            <AutoColumn gap="8px">
              <TYPE.header>
                {transactionCount ? transactionCount : "-"}
              </TYPE.header>
              <TYPE.main>Total Transactions</TYPE.main>
            </AutoColumn>
          </AccountDetailsLayout>
        </DashboardWrapper>
      </ContentWrapper>
    </PageWrapper>
  );
});

type AccountPageRouterComponentProps = {
  savedOpen: boolean;
  setSavedOpen: Dispatch<SetStateAction<boolean>>;
};

export const AccountPageRouterComponent: FC<AccountPageRouterComponentProps> =
  memo(({ savedOpen, setSavedOpen }) => {
    const params = useParams() as Record<string, any>;
    if (isAddress(params.accountAddress.toLowerCase())) {
      return (
        <LayoutWrapper savedOpen={savedOpen} setSavedOpen={setSavedOpen}>
          <AccountPage account={params.accountAddress.toLowerCase()} />
        </LayoutWrapper>
      );
    } else {
      return <Navigate to={"/charts"} />;
    }
  });

export default AccountPage;
