import { Dispatch, FC, SetStateAction, useState } from "react";
import "feather-icons";
import { Navigate, useParams } from "react-router-dom";
import { Text } from "rebass";
import styled from "styled-components";
import Link from "apps/charts/components/Link";
import Panel from "apps/charts/components/Panel";
import TokenLogo from "apps/charts/components/TokenLogo";
import PairList from "apps/charts/components/PairList";
import Loader from "apps/charts/components/LocalLoader";
import { AutoRow, RowBetween, RowFixed } from "apps/charts/components/Row";
import Column, { AutoColumn } from "apps/charts/components/Column";
import { ButtonLight, ButtonDark } from "apps/charts/components/ButtonStyled";
import TxnList from "apps/charts/components/TxnList";
import TokenChart from "apps/charts/components/TokenChart";
import { BasicLink } from "apps/charts/components/Link";
import Search from "apps/charts/components/Search";
import {
  formattedNum,
  formattedPercent,
  getPoolLink,
  getSwapLink,
  localNumber,
} from "apps/charts/utils";
import {
  useTokenData,
  useTokenTransactions,
  useTokenPairs,
} from "apps/charts/contexts/TokenData";
import { TYPE } from "apps/charts/Theme";
import { useColor } from "apps/charts/hooks";
import CopyHelper from "apps/charts/components/Copy";
import { useMedia } from "react-use";
import { useDataForList } from "apps/charts/contexts/PairData";
import { useEffect } from "react";
import Warning from "apps/charts/components/Warning";
import {
  usePathDismissed,
  useSavedTokens,
} from "apps/charts/contexts/LocalStorage";
import {
  Hover,
  PageWrapper,
  ContentWrapper,
  StyledIcon,
  BlockedWrapper,
  BlockedMessageWrapper,
} from "apps/charts/components";
import { PlusCircle, Bookmark, AlertCircle } from "react-feather";
import FormattedName from "apps/charts/components/FormattedName";
import { useListedTokens } from "apps/charts/contexts/Application";
import HoverText from "apps/charts/components/HoverText";
import {
  UNTRACKED_COPY,
  TOKEN_BLACKLIST,
  BLOCKED_WARNINGS,
} from "apps/charts/constants";
import QuestionHelper from "apps/charts/components/QuestionHelper";
import Checkbox from "apps/charts/components/Checkbox";
import { shortenAddress } from "apps/charts/utils";
import { TableHeaderBox } from "apps/charts/components/Row";
import { isAddress } from "apps/charts/utils";
import { LayoutWrapper } from "apps/charts/App";

const DashboardWrapper = styled.div`
  width: 100%;
`;

const PanelWrapper = styled.div`
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: max-content;
  gap: 6px;
  display: inline-grid;
  width: 100%;
  align-items: start;
  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
    align-items: stretch;
    > * {
      /* grid-column: 1 / 4; */
    }

    > * {
      &:first-child {
        width: 100%;
      }
    }
  }
`;

const TokenDetailsLayout = styled.div`
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

const WarningIcon = styled(AlertCircle)`
  stroke: ${({ theme }) => theme.text1};
  height: 16px;
  width: 16px;
  opacity: 0.6;
`;

const WarningGrouping = styled.div<{ disabled?: boolean }>`
  opacity: ${({ disabled }) => disabled && "0.4"};
  pointer-events: ${({ disabled }) => disabled && "none"};
`;

const HeaderWrapper = styled.div`
  background: ${({ theme }) => theme.headerBackground};
  border-radius: 8px;
  padding-top: 7px !important;
  padding-bottom: 7px !important;
`;

function TokenPage({ address }: { address: string }) {
  const {
    id,
    name,
    symbol,
    priceUSD,
    oneDayVolumeUSD,
    totalLiquidityUSD,
    volumeChangeUSD,
    oneDayVolumeUT,
    volumeChangeUT,
    priceChangeUSD,
    liquidityChangeUSD,
    oneDayTxns,
    txnChange,
  } = useTokenData(address);

  useEffect(() => {
    (document.querySelector("body") as HTMLBodyElement).scrollTo(0, 0);
  }, []);

  // detect color from token
  const backgroundColor = useColor(id);

  const allPairs = useTokenPairs(address);

  // pairs to show in pair list
  const fetchedPairsList = useDataForList(allPairs);

  // all transactions with this token
  const transactions = useTokenTransactions(address);

  // price
  const price = priceUSD ? formattedNum(priceUSD, true) : "";
  const priceChange = priceChangeUSD ? formattedPercent(priceChangeUSD) : "";

  // volume
  const volume = formattedNum(
    oneDayVolumeUSD ? oneDayVolumeUSD : oneDayVolumeUT,
    true
  );

  const usingUtVolume = oneDayVolumeUSD === 0 && !!oneDayVolumeUT;
  const volumeChange = formattedPercent(
    !usingUtVolume ? volumeChangeUSD : volumeChangeUT
  );

  // liquidity
  const liquidity = formattedNum(totalLiquidityUSD, true);
  const liquidityChange = formattedPercent(liquidityChangeUSD);

  // transactions
  const txnChangeFormatted = formattedPercent(txnChange);

  const below1080 = useMedia("(max-width: 1080px)");
  const below800 = useMedia("(max-width: 800px)");
  const below600 = useMedia("(max-width: 600px)");
  const below500 = useMedia("(max-width: 500px)");

  // format for long symbol
  const LENGTH = below1080 ? 10 : 16;
  const formattedSymbol =
    symbol?.length > LENGTH ? symbol.slice(0, LENGTH) + "..." : symbol;

  const [dismissed, markAsDismissed] = usePathDismissed(location.pathname);
  const [savedTokens, addToken] = useSavedTokens();
  const listedTokens = useListedTokens();

  useEffect(() => {
    window.scrollTo({
      behavior: "smooth",
      top: 0,
    });
  }, []);

  const [useTracked, setUseTracked] = useState(true);

  if (TOKEN_BLACKLIST.includes(address)) {
    return (
      <BlockedWrapper>
        <BlockedMessageWrapper>
          <AutoColumn gap="1rem" justify="center">
            <TYPE.light style={{ textAlign: "center" }}>
              {(BLOCKED_WARNINGS as any)[address] ??
                `This token is not supported.`}
            </TYPE.light>
            <Link
              external={true}
              href={
                "https://xdc.blocksscan.io/address/" +
                address.replace(/^.{2}/g, "xdc")
              }
            >{`More about ${shortenAddress(address)}`}</Link>
          </AutoColumn>
        </BlockedMessageWrapper>
      </BlockedWrapper>
    );
  }

  return (
    <PageWrapper>
      <Warning
        type={"token"}
        show={!dismissed && listedTokens && !listedTokens.includes(address)}
        setShow={markAsDismissed}
        address={address}
      />
      <ContentWrapper>
        <RowBetween style={{ flexWrap: "wrap", alignItems: "start" }}>
          <AutoRow align="flex-end" style={{ width: "fit-content" }}>
            <TYPE.body>
              <BasicLink to="/charts/tokens">{"Tokens "}</BasicLink>→ {symbol}
            </TYPE.body>
            <Link
              style={{ width: "fit-content" }}
              color={backgroundColor}
              external
              href={
                "https://xdc.blocksscan.io/address/" +
                address.replace(/^.{2}/g, "xdc")
              }
            >
              <Text
                style={{ marginLeft: ".15rem" }}
                fontSize={"14px"}
                fontWeight={400}
              >
                ({address.slice(0, 8) + "..." + address.slice(36, 42)})
              </Text>
            </Link>
          </AutoRow>
          {!below600 && <Search small={true} />}
        </RowBetween>
        <WarningGrouping
          disabled={
            !dismissed && listedTokens && !listedTokens.includes(address)
          }
        >
          <DashboardWrapper style={{ marginTop: below1080 ? "0" : "1rem" }}>
            <RowBetween
              style={{
                flexWrap: "wrap",
                marginBottom: "2rem",
                alignItems: "flex-start",
              }}
            >
              <RowFixed style={{ flexWrap: "wrap" }}>
                <RowFixed style={{ alignItems: "baseline" }}>
                  <TokenLogo
                    address={address}
                    size="32px"
                    style={{ alignSelf: "center" }}
                  />
                  <TYPE.main
                    fontSize={below1080 ? "1.5rem" : "2rem"}
                    fontWeight={500}
                    style={{ margin: "0 1rem" }}
                  >
                    <RowFixed gap="6px">
                      <FormattedName
                        text={name ? name + " " : ""}
                        maxCharacters={16}
                        style={{ marginRight: "6px" }}
                      />{" "}
                      {formattedSymbol ? `(${formattedSymbol})` : ""}
                    </RowFixed>
                  </TYPE.main>{" "}
                  {!below1080 && (
                    <>
                      <TYPE.main
                        fontSize={"1.5rem"}
                        fontWeight={500}
                        style={{ marginRight: "1rem" }}
                      >
                        {price}
                      </TYPE.main>
                      {priceChange}
                    </>
                  )}
                </RowFixed>
              </RowFixed>
              <span>
                <RowFixed
                  ml={below500 ? "0" : "2.5rem"}
                  mt={below500 ? "1rem" : "0"}
                >
                  {!savedTokens[address] && !below800 ? (
                    <Hover onClick={() => addToken(address, symbol)}>
                      <StyledIcon>
                        <PlusCircle style={{ marginRight: "0.5rem" }} />
                      </StyledIcon>
                    </Hover>
                  ) : !below1080 ? (
                    <StyledIcon>
                      <Bookmark
                        style={{ marginRight: "0.5rem", opacity: 0.4 }}
                      />
                    </StyledIcon>
                  ) : (
                    <></>
                  )}
                  <Link href={getPoolLink(address)} target="_blank">
                    <ButtonLight>+ Add Liquidity</ButtonLight>
                  </Link>
                  <Link href={getSwapLink(address)} target="_blank">
                    <ButtonDark ml={".5rem"} mr={below1080 && ".5rem"}>
                      Trade
                    </ButtonDark>
                  </Link>
                </RowFixed>
              </span>
            </RowBetween>

            <>
              {!below1080 && (
                <RowFixed>
                  <TYPE.main fontSize={"1.125rem"} mr="6px">
                    Token Stats
                  </TYPE.main>
                  {usingUtVolume && (
                    <HoverText text={UNTRACKED_COPY}>
                      <WarningIcon />
                    </HoverText>
                  )}
                </RowFixed>
              )}
              <PanelWrapper style={{ marginTop: below1080 ? "0" : "1rem" }}>
                {below1080 && price && (
                  <Panel>
                    <AutoColumn gap="20px">
                      <RowBetween>
                        <TYPE.main>Price</TYPE.main>
                        <div />
                      </RowBetween>
                      <RowBetween align="flex-end">
                        {" "}
                        <TYPE.main
                          fontSize={"1.5rem"}
                          lineHeight={1}
                          fontWeight={500}
                        >
                          {price}
                        </TYPE.main>
                        <TYPE.main>{priceChange}</TYPE.main>
                      </RowBetween>
                    </AutoColumn>
                  </Panel>
                )}
                <Panel>
                  <AutoColumn gap="20px">
                    <RowBetween>
                      <TYPE.main>Total Liquidity</TYPE.main>
                      <div />
                    </RowBetween>
                    <RowBetween align="flex-end">
                      <TYPE.main
                        fontSize={"1.5rem"}
                        lineHeight={1}
                        fontWeight={500}
                      >
                        {liquidity}
                      </TYPE.main>
                      <TYPE.main>{liquidityChange}</TYPE.main>
                    </RowBetween>
                  </AutoColumn>
                </Panel>
                <Panel>
                  <AutoColumn gap="20px">
                    <RowBetween>
                      <TYPE.main>Volume (24hrs)</TYPE.main>
                      <div />
                    </RowBetween>
                    <RowBetween align="flex-end">
                      <TYPE.main
                        fontSize={"1.5rem"}
                        lineHeight={1}
                        fontWeight={500}
                      >
                        {volume}
                      </TYPE.main>
                      <TYPE.main>{volumeChange}</TYPE.main>
                    </RowBetween>
                  </AutoColumn>
                </Panel>

                <Panel>
                  <AutoColumn gap="20px">
                    <RowBetween>
                      <TYPE.main>Transactions (24hrs)</TYPE.main>
                      <div />
                    </RowBetween>
                    <RowBetween align="flex-end">
                      <TYPE.main
                        fontSize={"1.5rem"}
                        lineHeight={1}
                        fontWeight={500}
                      >
                        {oneDayTxns ? localNumber(oneDayTxns) : 0}
                      </TYPE.main>
                      <TYPE.main>{txnChangeFormatted}</TYPE.main>
                    </RowBetween>
                  </AutoColumn>
                </Panel>
                <Panel
                  style={{
                    gridColumn: below1080 ? "1" : "2/4",
                    gridRow: below1080 ? "" : "1/4",
                  }}
                >
                  <TokenChart
                    address={address}
                    base={priceUSD}
                    color={"#003CFF"}
                  />
                </Panel>
              </PanelWrapper>
            </>

            <RowBetween style={{ marginTop: "3rem", marginBottom: "2rem" }}>
              <TYPE.main fontSize={"1.125rem"}>Top Pairs</TYPE.main>
              <AutoRow gap="4px" style={{ width: "fit-content" }}>
                <Checkbox
                  checked={useTracked}
                  setChecked={() => setUseTracked(!useTracked)}
                  text={"Hide untracked pairs"}
                />
                <QuestionHelper text="USD amounts may be inaccurate in low liquiidty pairs or pairs without ETH or stablecoins." />
              </AutoRow>
            </RowBetween>
            {address && fetchedPairsList ? (
              <PairList pairs={fetchedPairsList} useTracked={useTracked} />
            ) : (
              <Loader />
            )}
            <RowBetween mt={40} mb={"2rem"}>
              <TYPE.main fontSize={"1.125rem"}>Transactions</TYPE.main> <div />
            </RowBetween>
            {transactions ? (
              <TxnList transactions={transactions} />
            ) : (
              <Loader />
            )}
            <>
              <HeaderWrapper
                style={{
                  marginTop: "3rem",
                  marginBottom: "2rem",
                  padding: "0px 1.125rem",
                }}
              >
                <TableHeaderBox>Token Information</TableHeaderBox>{" "}
              </HeaderWrapper>
              <TokenDetailsLayout>
                <Column>
                  <TYPE.main>Symbol</TYPE.main>
                  <TYPE.main style={{ marginTop: ".5rem" }} fontWeight="500">
                    <FormattedName text={symbol} maxCharacters={12} />
                  </TYPE.main>
                </Column>
                <Column>
                  <TYPE.main>Name</TYPE.main>
                  <TYPE.main style={{ marginTop: ".5rem" }} fontWeight="500">
                    <FormattedName text={name} maxCharacters={16} />
                  </TYPE.main>
                </Column>
                <Column>
                  <TYPE.main>Address</TYPE.main>
                  <AutoRow align="flex-end">
                    <TYPE.main style={{ marginTop: ".5rem" }} fontWeight="500">
                      {address.slice(0, 8) + "..." + address.slice(36, 42)}
                    </TYPE.main>
                    <CopyHelper toCopy={address} />
                  </AutoRow>
                </Column>
                <ButtonLight>
                  <Link
                    external
                    href={
                      "https://xdc.blocksscan.io/address/" +
                      address.replace(/^.{2}/g, "xdc")
                    }
                  >
                    View on BlocksScan ↗
                  </Link>
                </ButtonLight>
              </TokenDetailsLayout>
            </>
          </DashboardWrapper>
        </WarningGrouping>
      </ContentWrapper>
    </PageWrapper>
  );
}

type TokenPageRouterComponentProps = {
  savedOpen: boolean;
  setSavedOpen: Dispatch<SetStateAction<boolean>>;
};

export const TokenPageRouterComponent: FC<TokenPageRouterComponentProps> = ({
  savedOpen,
  setSavedOpen,
}) => {
  const params = useParams() as Record<string, any>;
  if (
    isAddress(params.tokenAddress?.toLowerCase()) &&
    !Object.keys(TOKEN_BLACKLIST).includes(params.tokenAddress?.toLowerCase())
  ) {
    return (
      <LayoutWrapper savedOpen={savedOpen} setSavedOpen={setSavedOpen}>
        <TokenPage address={params.tokenAddress.toLowerCase()} />
      </LayoutWrapper>
    );
  } else {
    return <Navigate to={"/charts"} />;
  }
};

export default TokenPage;
