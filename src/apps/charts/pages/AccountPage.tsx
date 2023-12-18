import {
  useState,
  useMemo,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
  FC,
} from "react";
import styled from "styled-components";
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
import { Bookmark, Activity } from "react-feather";
import Link from "apps/charts/components/Link";
import { FEE_WARNING_TOKENS } from "apps/charts/constants";
import { BasicLink } from "apps/charts/components/Link";
import { useMedia } from "react-use";
import Search from "apps/charts/components/Search";
import { useSavedAccounts } from "apps/charts/contexts/LocalStorage";
import { TableHeaderBox } from "apps/charts/components/Row";
import { Position } from "apps/charts/utils/returns";
import { LayoutWrapper } from "apps/charts/App";
import { Navigate, useParams } from "react-router-dom";

const AccountWrapper = styled.div`
  background-color: transparent;
  padding: 6px 16px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Header = styled.div``;

const DashboardWrapper = styled.div`
  width: 100%;
`;

const DropdownWrapper = styled.div`
  position: relative;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.borderBG};
  border-radius: 12px;
`;

const Flyout = styled.div`
  position: absolute;
  top: 38px;
  left: -1px;
  width: 100%;
  background-color: ${({ theme }) => theme.bg1};
  z-index: 999;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  padding-top: 4px;
  border: 1px solid ${({ theme }) => theme.borderBG};
  border-top: none;
`;

const MenuRow = styled(Row)`
  width: 100%;
  padding: 12px 0;
  padding-left: 12px;

  :hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.bg2};
  }
`;

const PanelWrapper = styled.div`
  grid-template-columns: 1fr;
  grid-template-rows: max-content;
  gap: 6px;
  display: inline-grid;
  width: 100%;
  align-items: start;
`;

const Warning = styled.div`
  background-color: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text1};
  padding: 1rem;
  font-weight: 600;
  border-radius: 10px;
  margin-bottom: 1rem;
  width: calc(100% - 2rem);
`;

const HeaderWrapper = styled.div`
  background: ${({ theme }) => theme.headerBackground};
  border-radius: 8px;
  font-size: 1.125rem;
  padding: 7px 1.125rem 7px;
  margin-top: 3rem;
  margin-bottom: 1rem;
`;

const AccountDetailsLayout = styled.div`
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
`;

function AccountPage(props: { account: string }) {
  const { account } = props;
  // get data for this account
  const transactions = useUserTransactions(account);
  const positions = useUserPositions(account);

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
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [activePosition, setActivePosition] = useState<Position>();

  const dynamicPositions = activePosition ? [activePosition] : positions;

  const aggregateFees = dynamicPositions?.reduce(function (
    total: any,
    position: { fees: { sum: any } }
  ) {
    return total + position.fees.sum;
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

  const below600 = useMedia("(max-width: 600px)");

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
            <BasicLink to="/accounts">{"Accounts "}</BasicLink>→{" "}
            <Link
              lineHeight={"145.23%"}
              href={
                "https://xdc.blocksscan.io/address/" +
                account.replace(/^.{2}/g, "xdc")
              }
              target="_blank"
            >
              {" "}
              {account?.slice(0, 42)}{" "}
            </Link>
          </TYPE.body>
          {!below600 && <Search small={true} />}
        </RowBetween>
        <Header>
          <RowBetween>
            <span>
              <TYPE.header fontSize={24}>
                {account?.slice(0, 6) + "..." + account?.slice(38, 42)}
              </TYPE.header>
              <Link
                lineHeight={"145.23%"}
                href={
                  "https://xdc.blocksscan.io/address/" +
                  account.replace(/^.{2}/g, "xdc")
                }
                target="_blank"
              >
                <TYPE.main fontSize={14}>View on BlocksScan</TYPE.main>
              </Link>
            </span>
            <AccountWrapper>
              <StyledIcon>
                <Bookmark
                  onClick={handleBookmarkClick}
                  style={{
                    opacity: isBookmarked ? 0.8 : 0.4,
                    cursor: "pointer",
                  }}
                />
              </StyledIcon>
            </AccountWrapper>
          </RowBetween>
        </Header>
        <DashboardWrapper>
          {showWarning && (
            <Warning>
              Fees cannot currently be calculated for pairs that include AMPL.
            </Warning>
          )}
          {!hideLPContent && (
            <DropdownWrapper>
              <ButtonDropdown
                width="100%"
                onClick={() => setShowDropdown(!showDropdown)}
                open={showDropdown}
              >
                {!activePosition && (
                  <RowFixed>
                    <StyledIcon>
                      <Activity size={16} />
                    </StyledIcon>
                    <TYPE.body ml={"10px"}>All Positions</TYPE.body>
                  </RowFixed>
                )}
                {activePosition && (
                  <RowFixed>
                    <DoubleTokenLogo
                      a0={activePosition.pair.token0.id}
                      a1={activePosition.pair.token1.id}
                      size={16}
                    />
                    <TYPE.body ml={"16px"}>
                      {activePosition.pair.token0.symbol}-
                      {activePosition.pair.token1.symbol} Position
                    </TYPE.body>
                  </RowFixed>
                )}
              </ButtonDropdown>
              {showDropdown && (
                <Flyout>
                  <AutoColumn gap="0px">
                    {positions?.map((p: any, i: any) => {
                      if (p.pair.token1.symbol === "WXDC") {
                        p.pair.token1.symbol = "XDC";
                      }
                      if (p.pair.token0.symbol === "WXDC") {
                        p.pair.token0.symbol = "XDC";
                      }
                      return (
                        p.pair.id !== activePosition?.pair.id && (
                          <MenuRow
                            onClick={() => {
                              setActivePosition(p);
                              setShowDropdown(false);
                            }}
                            key={i}
                          >
                            <DoubleTokenLogo
                              a0={p.pair.token0.id}
                              a1={p.pair.token1.id}
                              size={16}
                            />
                            <TYPE.body ml={"16px"}>
                              {p.pair.token0.symbol}-{p.pair.token1.symbol}{" "}
                              Position
                            </TYPE.body>
                          </MenuRow>
                        )
                      );
                    })}
                    {activePosition && (
                      <MenuRow
                        onClick={() => {
                          setActivePosition({} as Position);
                          setShowDropdown(false);
                        }}
                      >
                        <RowFixed>
                          <StyledIcon>
                            <Activity size={16} />
                          </StyledIcon>
                          <TYPE.body ml={"10px"}>All Positions</TYPE.body>
                        </RowFixed>
                      </MenuRow>
                    )}
                  </AutoColumn>
                </Flyout>
              )}
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
              <Panel style={{ gridColumn: "1" }}>
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
}

type AccountPageRouterComponentProps = {
  savedOpen: boolean;
  setSavedOpen: Dispatch<SetStateAction<boolean>>;
};

export const AccountPageRouterComponent: FC<
  AccountPageRouterComponentProps
> = ({ savedOpen, setSavedOpen }) => {
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
};

export default AccountPage;
