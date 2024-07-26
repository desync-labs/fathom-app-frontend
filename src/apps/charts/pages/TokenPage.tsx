import {
  Dispatch,
  FC,
  memo,
  SetStateAction,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Navigate, useParams } from "react-router-dom";
import { Box, styled, Typography, useMediaQuery } from "@mui/material";

import Link, { CustomLink } from "apps/charts/components/Link";
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
import { useDataForList } from "apps/charts/contexts/PairData";
import Warning from "apps/charts/components/Warning";
import {
  usePathDismissed,
  useSavedTokens,
} from "apps/charts/contexts/LocalStorage";
import {
  PageWrapper,
  ContentWrapper,
  StyledIcon,
  BlockedWrapper,
  BlockedMessageWrapper,
} from "apps/charts/components";
import FormattedName from "apps/charts/components/FormattedName";
import { useListedTokens } from "apps/charts/contexts/Application";
import {
  UNTRACKED_COPY,
  TOKEN_BLACKLIST,
  BLOCKED_WARNINGS,
} from "apps/charts/constants";
import Checkbox from "apps/charts/components/Checkbox";
import { shortenAddress } from "apps/charts/utils";
import { TableHeaderBox } from "apps/charts/components/Row";
import { isAddress } from "apps/charts/utils";
import { LayoutWrapper } from "apps/charts/App";
import BasePopover from "components/Base/Popover/BasePopover";

import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import useSharedContext from "context/shared";

const DashboardWrapper = styled(Box)`
  width: 100%;
`;

const PanelWrapper = styled(Box)`
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
      &:first-of-type {
        width: 100%;
      }
    }
  }
`;

const TokenDetailsLayout = styled(Box)`
  display: inline-grid;
  width: calc(100% - 1.25rem);
  grid-template-columns: auto auto auto 1fr;
  column-gap: 75px;
  align-items: start;
  padding-left: 1.25rem;

  &:last-child {
    align-items: center;
    justify-items: end;
  }
  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
    align-items: stretch;
    gap: 18px;

    &:last-child {
      align-items: center;
      justify-items: start;
    }
  }
`;

const WarningGrouping = styled(Box)<{ disabled?: boolean }>`
  opacity: ${({ disabled }) => disabled && "0.4"};
  pointer-events: ${({ disabled }) => disabled && "none"};
`;

const HeaderWrapper = styled(Box)`
  background: #2c4066;
  border-radius: 8px;
  padding-top: 7px !important;
  padding-bottom: 7px !important;
`;

const TokenPage: FC<{ address: string }> = memo(({ address }) => {
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

  const { isMobile } = useSharedContext();

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

  const below1080 = useMediaQuery("(max-width: 1080px)");
  const below600 = useMediaQuery("(max-width: 600px)");
  const below500 = useMediaQuery("(max-width: 500px)");

  // format for long symbol
  const LENGTH = below1080 ? 10 : 16;
  const formattedSymbol =
    symbol?.length > LENGTH ? symbol.slice(0, LENGTH) + "..." : symbol;

  const [dismissed, markAsDismissed] = usePathDismissed(location.pathname);
  const [savedTokens, addToken, removeToken] = useSavedTokens();
  const listedTokens = useListedTokens();

  useEffect(() => {
    window.scrollTo({
      behavior: "smooth",
      top: 0,
    });
  }, []);

  const [useTracked, setUseTracked] = useState(true);

  const handleBookmarkClick = useCallback(() => {
    savedTokens[address] ? removeToken(address) : addToken(address, symbol);
  }, [address, savedTokens, addToken, removeToken]);

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
        show={
          !dismissed && listedTokens && !(listedTokens as any).includes(address)
        }
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
                "https://xdc.blocksscan.io/tokens/" +
                address.replace(/^.{2}/g, "xdc")
              }
            >
              <Typography
                style={{ marginLeft: ".15rem" }}
                fontSize={"14px"}
                fontWeight={400}
              >
                ({address.slice(0, 8) + "..." + address.slice(36, 42)})
              </Typography>
            </Link>
          </AutoRow>
          {!below600 && <Search small={true} />}
        </RowBetween>
        <WarningGrouping
          disabled={
            !dismissed &&
            listedTokens &&
            !(listedTokens as any).includes(address)
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
                    <RowFixed style={{ gap: "6px" }}>
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
              <RowFixed
                ml={below500 ? "0" : "2.5rem"}
                mt={below500 ? "1rem" : "0"}
                gap={".5rem"}
              >
                <StyledIcon>
                  <BookmarkBorderIcon
                    onClick={handleBookmarkClick}
                    style={{
                      width: "28px",
                      height: "28px",
                      opacity: savedTokens[address] ? 0.8 : 0.4,
                      cursor: "pointer",
                    }}
                  />
                </StyledIcon>
                <CustomLink to={getPoolLink(address)}>
                  <ButtonLight>+ Add Liquidity</ButtonLight>
                </CustomLink>
                <CustomLink to={getSwapLink(address)}>
                  <ButtonDark>Trade</ButtonDark>
                </CustomLink>
              </RowFixed>
            </RowBetween>

            <>
              {!below1080 && (
                <RowFixed alignItems={"center"}>
                  <TYPE.main fontSize={"1.125rem"} mr="6px">
                    Token Stats
                  </TYPE.main>
                  {usingUtVolume && (
                    <BasePopover id={"token_stats"} text={UNTRACKED_COPY} />
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
                    padding: isMobile ? "1.25rem 0 1.25rem 1.25rem" : "1.25rem",
                  }}
                >
                  <TokenChart
                    address={address}
                    base={priceUSD}
                    color={"#43fff6"}
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
                <BasePopover
                  id="untracked_pairs"
                  text="USD amounts may be inaccurate in low liquiidty pairs or pairs without XDC or stablecoins."
                />
              </AutoRow>
            </RowBetween>
            {address && fetchedPairsList ? (
              <PairList pairs={fetchedPairsList} useTracked={useTracked} />
            ) : (
              <Loader />
            )}
            <RowBetween mt={"40px"} mb={"2rem"}>
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
                  marginTop: "2rem",
                  marginBottom: "1rem",
                  padding: "0px 1.125rem",
                }}
              >
                <TableHeaderBox>Token Information</TableHeaderBox>{" "}
              </HeaderWrapper>
              <TokenDetailsLayout>
                <Column>
                  <TYPE.main>Symbol</TYPE.main>
                  <TYPE.main style={{ marginTop: ".15rem" }} fontWeight="500">
                    <FormattedName text={symbol} maxCharacters={12} />
                  </TYPE.main>
                </Column>
                <Column>
                  <TYPE.main>Name</TYPE.main>
                  <TYPE.main style={{ marginTop: ".15rem" }} fontWeight="500">
                    <FormattedName text={name} maxCharacters={16} />
                  </TYPE.main>
                </Column>
                <Column>
                  <TYPE.main>Address</TYPE.main>
                  <AutoRow align="flex-end">
                    <TYPE.main style={{ marginTop: ".15rem" }} fontWeight="500">
                      {address.slice(0, 8) + "..." + address.slice(36, 42)}
                    </TYPE.main>
                    <CopyHelper toCopy={address} />
                  </AutoRow>
                </Column>
                <ButtonLight>
                  <Link
                    external
                    href={
                      "https://xdc.blocksscan.io/tokens/" +
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
});

type TokenPageRouterComponentProps = {
  savedOpen: boolean;
  setSavedOpen: Dispatch<SetStateAction<boolean>>;
};

export const TokenPageRouterComponent: FC<TokenPageRouterComponentProps> = memo(
  ({ savedOpen, setSavedOpen }) => {
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
  }
);

export default TokenPage;
