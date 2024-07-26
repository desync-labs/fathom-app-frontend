import { Dispatch, FC, memo, SetStateAction, useEffect } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Box, styled, useMediaQuery } from "@mui/material";

import Panel from "apps/charts/components/Panel";
import {
  PageWrapper,
  ContentWrapperLarge,
  StyledIcon,
  BlockedWrapper,
  BlockedMessageWrapper,
} from "apps/charts/components";
import { AutoRow, RowBetween, RowFixed } from "apps/charts/components/Row";
import Column, { AutoColumn } from "apps/charts/components/Column";
import { ButtonLight, ButtonDark } from "apps/charts/components/ButtonStyled";
import PairChart from "apps/charts/components/PairChart";
import Link, { CustomLink } from "apps/charts/components/Link";
import TxnList from "apps/charts/components/TxnList";
import Loader from "apps/charts/components/LocalLoader";
import { BasicLink } from "apps/charts/components/Link";
import Search from "apps/charts/components/Search";
import {
  formattedNum,
  formattedPercent,
  getPoolLink,
  getSwapLink,
  shortenAddress,
} from "apps/charts/utils";
import {
  usePairData,
  usePairTransactions,
} from "apps/charts/contexts/PairData";
import { TYPE } from "apps/charts/Theme";
import CopyHelper from "apps/charts/components/Copy";
import DoubleTokenLogo from "apps/charts/components/DoubleLogo";
import TokenLogo from "apps/charts/components/TokenLogo";
import { Hover } from "apps/charts/components";
import { useEthPrice } from "apps/charts/contexts/GlobalData";
import Warning from "apps/charts/components/Warning";
import {
  usePathDismissed,
  useSavedPairs,
} from "apps/charts/contexts/LocalStorage";
import FormattedName from "apps/charts/components/FormattedName";
import { useListedTokens } from "apps/charts/contexts/Application";
import {
  UNTRACKED_COPY,
  PAIR_BLACKLIST,
  BLOCKED_WARNINGS,
} from "apps/charts/constants";
import { TableHeaderBox } from "apps/charts/components/Row";
import LocalLoader from "apps/charts/components/LocalLoader";
import { isAddress } from "apps/charts/utils";
import { LayoutWrapper } from "apps/charts/App";

import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import useSharedContext from "context/shared";
import BasePopover from "components/Base/Popover/BasePopover";

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
  width: calc(100% - 1.125rem);
  grid-template-columns: auto auto auto auto 1fr;
  column-gap: 60px;
  align-items: start;
  padding-left: 1.125rem;

  &:last-child {
    align-items: center;
    justify-items: end;
  }

  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
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

const FixedPanel = styled(Panel)`
  width: fit-content;
  border: 1px solid #2c4066;
  background: #132340;
  padding: 8px 12px;

  :hover {
    cursor: pointer;
    background-color: #324567;
  }
`;

const HoverSpan = styled("span")`
  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`;

const WarningGrouping = styled(Box)<{ disabled?: boolean }>`
  opacity: ${({ disabled }) => disabled && "0.4"};
  pointer-events: ${({ disabled }) => disabled && "none"};
  overflow: hidden;
`;
const HeaderWrapper = styled(Box)`
  background: #2c4066;
  border-radius: 8px;
  padding-top: 7px !important;
  padding-bottom: 7px !important;
`;

const PairPage: FC<{ pairAddress: string }> = memo(({ pairAddress }) => {
  const {
    token0,
    token1,
    reserve0,
    reserve1,
    reserveUSD,
    trackedReserveUSD,
    oneDayVolumeUSD,
    volumeChangeUSD,
    oneDayVolumeUntracked,
    volumeChangeUntracked,
    liquidityChangeUSD,
    token0Price,
    token1Price,
  } = usePairData(pairAddress);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    (document.querySelector("body") as HTMLBodyElement).scrollTo(0, 0);
  }, []);

  const [dismissed, markAsDismissed] = usePathDismissed(location.pathname);

  useEffect(() => {
    window.scrollTo({
      behavior: "smooth",
      top: 0,
    });
  }, []);

  const [savedPairs, addPair, removePair] = useSavedPairs();
  const { isMobile } = useSharedContext();

  const listedTokens = useListedTokens();

  const transactions = usePairTransactions(pairAddress);

  const below1080 = useMediaQuery("(max-width: 1080px)");
  const below900 = useMediaQuery("(max-width: 900px)");
  const below600 = useMediaQuery("(max-width: 600px)");

  const formattedLiquidity = reserveUSD
    ? formattedNum(reserveUSD, true)
    : formattedNum(trackedReserveUSD, true);
  const usingUntrackedLiquidity = !trackedReserveUSD && !!reserveUSD;
  const liquidityChange = formattedPercent(liquidityChangeUSD);

  // volume
  const volume = oneDayVolumeUSD
    ? formattedNum(oneDayVolumeUSD, true)
    : formattedNum(oneDayVolumeUntracked, true);
  const usingUtVolume = oneDayVolumeUSD === 0 && !!oneDayVolumeUntracked;
  const volumeChange = formattedPercent(
    !usingUtVolume ? volumeChangeUSD : volumeChangeUntracked
  );

  const showUSDWaning = usingUntrackedLiquidity || usingUtVolume;

  // get fees	  // get fees
  const fees =
    oneDayVolumeUSD || oneDayVolumeUSD === 0
      ? usingUtVolume
        ? formattedNum(oneDayVolumeUntracked * 0.003, true)
        : formattedNum(oneDayVolumeUSD * 0.003, true)
      : "-";

  // token data for usd
  const [ethPrice] = useEthPrice();
  let token0USD =
    token0?.derivedETH && ethPrice
      ? formattedNum(parseFloat(token0.derivedETH) * parseFloat(ethPrice), true)
      : "";

  let token1USD =
    token1?.derivedETH && ethPrice
      ? formattedNum(parseFloat(token1.derivedETH) * parseFloat(ethPrice), true)
      : "";

  /**
   * If data still not fetched.
   */
  if (!token0 || !token1) {
    return <LocalLoader fill="true" />;
  }

  const symbols = ["FXD", "xUSDT", "USDTx"];
  if (symbols.includes(token0?.symbol) && symbols.includes(token1?.symbol)) {
    if (token0?.symbol === "FXD") {
      token0USD = formattedNum(token1Price, true);
    } else if (token1?.symbol === "FXD") {
      token1USD = formattedNum(token0Price, true);
    }
  }

  // rates
  const token0Rate =
    reserve0 && reserve1 ? formattedNum(reserve1 / reserve0) : "-";
  const token1Rate =
    reserve0 && reserve1 ? formattedNum(reserve0 / reserve1) : "-";

  // formatted symbols for overflow
  const formattedSymbol0 =
    token0?.symbol.length > 6
      ? token0?.symbol.slice(0, 5) + "..."
      : token0?.symbol;
  const formattedSymbol1 =
    token1?.symbol.length > 6
      ? token1?.symbol.slice(0, 5) + "..."
      : token1?.symbol;

  const handleBookmarkClick = () => {
    savedPairs[pairAddress]
      ? removePair(pairAddress)
      : addPair(
          pairAddress,
          token0.id,
          token1.id,
          token0.symbol,
          token1.symbol
        );
  };

  if (PAIR_BLACKLIST.includes(pairAddress)) {
    return (
      <BlockedWrapper>
        <BlockedMessageWrapper>
          <AutoColumn gap="1rem" justify="center">
            <TYPE.light style={{ textAlign: "center" }}>
              {(BLOCKED_WARNINGS as any)[pairAddress] ??
                `This pair is not supported.`}
            </TYPE.light>
            <Link
              external={true}
              href={
                "https://xdc.blocksscan.io/address/" +
                pairAddress.replace(/^.{2}/g, "xdc")
              }
            >{`More about ${shortenAddress(pairAddress)}`}</Link>
          </AutoColumn>
        </BlockedMessageWrapper>
      </BlockedWrapper>
    );
  }

  return (
    <PageWrapper>
      <span />
      <Warning
        type={"pair"}
        show={
          !dismissed &&
          listedTokens &&
          !(
            listedTokens.includes(token0?.id) &&
            listedTokens.includes(token1?.id)
          )
        }
        setShow={markAsDismissed}
        address={pairAddress}
      />
      <ContentWrapperLarge>
        <RowBetween>
          <TYPE.body>
            <BasicLink to="/charts/pairs">{"Pairs "}</BasicLink>→{" "}
            {token0?.symbol}-{token1?.symbol}
          </TYPE.body>
          {!below600 && <Search small={true} />}
        </RowBetween>
        <WarningGrouping
          disabled={
            !dismissed &&
            listedTokens &&
            !(
              listedTokens.includes(token0?.id) &&
              listedTokens.includes(token1?.id)
            )
          }
        >
          <DashboardWrapper>
            <AutoColumn gap="40px" style={{ marginBottom: "1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  width: "100%",
                }}
              >
                <RowFixed style={{ flexWrap: "wrap", minWidth: "100px" }}>
                  <RowFixed>
                    {token0 && token1 && (
                      <DoubleTokenLogo
                        a0={token0?.id || ""}
                        a1={token1?.id || ""}
                        size={32}
                      />
                    )}{" "}
                    <TYPE.main
                      fontSize={below1080 ? "1.5rem" : "2rem"}
                      style={{ margin: "0 1rem" }}
                    >
                      {token0 && token1 ? (
                        <>
                          <HoverSpan
                            onClick={() =>
                              navigate(`/charts/token/${token0?.id}`)
                            }
                          >
                            {token0.symbol}
                          </HoverSpan>
                          <span>-</span>
                          <HoverSpan
                            onClick={() =>
                              navigate(`/charts/token/${token1?.id}`)
                            }
                          >
                            {token1.symbol}
                          </HoverSpan>{" "}
                          Pair
                        </>
                      ) : (
                        ""
                      )}
                    </TYPE.main>
                  </RowFixed>
                </RowFixed>
                <RowFixed
                  ml={below900 ? "0" : "2.5rem"}
                  mt={below1080 ? "1rem" : ""}
                  gap={".5rem"}
                >
                  <StyledIcon>
                    <BookmarkBorderIcon
                      onClick={handleBookmarkClick}
                      style={{
                        width: "28px",
                        height: "28px",
                        opacity: savedPairs[pairAddress] ? 0.8 : 0.4,
                        cursor: "pointer",
                      }}
                    />
                  </StyledIcon>
                  <CustomLink to={getPoolLink(token0?.id, token1?.id)}>
                    <ButtonLight>+ Add Liquidity</ButtonLight>
                  </CustomLink>
                  <CustomLink to={getSwapLink(token0?.id, token1?.id)}>
                    <ButtonDark>Trade</ButtonDark>
                  </CustomLink>
                </RowFixed>
              </div>
            </AutoColumn>
            <AutoRow
              gap="6px"
              style={{
                width: "fit-content",
                marginTop: below900 ? "1rem" : "0",
                marginBottom: below900 ? "0" : "2rem",
                flexWrap: "wrap",
              }}
            >
              <FixedPanel
                onClick={() => navigate(`/charts/token/${token0?.id}`)}
              >
                <RowFixed>
                  <TokenLogo address={token0?.id} size={"16px"} />
                  <TYPE.main
                    fontSize={"16px"}
                    lineHeight={1}
                    fontWeight={500}
                    ml={"4px"}
                  >
                    {token0 && token1
                      ? `1 ${formattedSymbol0} = ${token0Rate} ${formattedSymbol1} ${
                          parseFloat(token0?.derivedETH)
                            ? "(" + token0USD + ")"
                            : ""
                        }`
                      : "-"}
                  </TYPE.main>
                </RowFixed>
              </FixedPanel>
              <FixedPanel
                onClick={() => navigate(`/charts/token/${token1?.id}`)}
              >
                <RowFixed>
                  <TokenLogo address={token1?.id} size={"16px"} />
                  <TYPE.main
                    fontSize={"16px"}
                    lineHeight={1}
                    fontWeight={500}
                    ml={"4px"}
                  >
                    {token0 && token1
                      ? `1 ${formattedSymbol1} = ${token1Rate} ${formattedSymbol0}  ${
                          parseFloat(token1?.derivedETH)
                            ? "(" + token1USD + ")"
                            : ""
                        }`
                      : "-"}
                  </TYPE.main>
                </RowFixed>
              </FixedPanel>
            </AutoRow>
            <>
              {!below1080 && (
                <RowFixed>
                  <TYPE.main fontSize={"1.125rem"} mr="6px">
                    Pair Stats
                  </TYPE.main>
                  {showUSDWaning ? (
                    <BasePopover id={"pair_stats"} text={UNTRACKED_COPY} />
                  ) : null}
                </RowFixed>
              )}
              <PanelWrapper style={{ marginTop: "1.5rem" }}>
                <Panel style={{ height: "100%" }}>
                  <AutoColumn gap="20px">
                    <RowBetween>
                      <TYPE.main>Total Liquidity </TYPE.main>
                      <div />
                    </RowBetween>
                    <RowBetween align="flex-end">
                      <TYPE.main
                        fontSize={"1.5rem"}
                        lineHeight={1}
                        fontWeight={500}
                      >
                        {formattedLiquidity}
                      </TYPE.main>
                      <TYPE.main>{liquidityChange}</TYPE.main>
                    </RowBetween>
                  </AutoColumn>
                </Panel>
                <Panel style={{ height: "100%" }}>
                  <AutoColumn gap="20px">
                    <RowBetween>
                      <TYPE.main>Volume (24hrs) </TYPE.main>
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
                <Panel style={{ height: "100%" }}>
                  <AutoColumn gap="20px">
                    <RowBetween>
                      <TYPE.main>Fees (24hrs)</TYPE.main>
                      <div />
                    </RowBetween>
                    <RowBetween align="flex-end">
                      <TYPE.main
                        fontSize={"1.5rem"}
                        lineHeight={1}
                        fontWeight={500}
                      >
                        {fees}
                      </TYPE.main>
                      <TYPE.main>{volumeChange}</TYPE.main>
                    </RowBetween>
                  </AutoColumn>
                </Panel>
                <Panel style={{ height: "100%" }}>
                  <AutoColumn gap="20px">
                    <RowBetween>
                      <TYPE.main>Pooled Tokens</TYPE.main>
                      <div />
                    </RowBetween>
                    <Hover
                      onClick={() => navigate(`/charts/token/${token0?.id}`)}
                      fade={true}
                    >
                      <AutoRow gap="4px">
                        <TokenLogo address={token0?.id} />
                        <TYPE.main
                          fontSize={20}
                          lineHeight={1}
                          fontWeight={500}
                        >
                          <RowFixed>
                            {reserve0 ? formattedNum(reserve0) : ""}{" "}
                            <FormattedName
                              text={token0?.symbol ?? ""}
                              maxCharacters={8}
                              margin="0 4px"
                            />
                          </RowFixed>
                        </TYPE.main>
                      </AutoRow>
                    </Hover>
                    <Hover
                      onClick={() => navigate(`/charts/token/${token1?.id}`)}
                      fade={true}
                    >
                      <AutoRow gap="4px">
                        <TokenLogo address={token1?.id} />
                        <TYPE.main
                          fontSize={20}
                          lineHeight={1}
                          fontWeight={500}
                        >
                          <RowFixed>
                            {reserve1 ? formattedNum(reserve1) : ""}{" "}
                            <FormattedName
                              text={token1?.symbol ?? ""}
                              maxCharacters={8}
                              margin="0 4px"
                            />
                          </RowFixed>
                        </TYPE.main>
                      </AutoRow>
                    </Hover>
                  </AutoColumn>
                </Panel>
                <Panel
                  style={{
                    gridColumn: below1080 ? "1" : "2/4",
                    gridRow: below1080 ? "" : "1/5",
                    padding: isMobile ? "1.25rem 0 1.25rem 1.25rem" : "1.25rem",
                  }}
                >
                  <PairChart
                    address={pairAddress}
                    base0={reserve1 / reserve0}
                    base1={reserve0 / reserve1}
                    color="#43fff6"
                  />
                </Panel>
              </PanelWrapper>
              <TYPE.main
                fontSize={"1.125rem"}
                style={{ marginTop: "3rem", marginBottom: "2rem" }}
              >
                Transactions
              </TYPE.main>{" "}
              {transactions ? (
                <TxnList transactions={transactions} />
              ) : (
                <Loader />
              )}
              <HeaderWrapper
                style={{
                  marginTop: "2rem",
                  marginBottom: "1rem",
                  padding: "0 1.125rem 1rem",
                }}
              >
                <TableHeaderBox>Pair Information</TableHeaderBox>{" "}
              </HeaderWrapper>
              <TokenDetailsLayout>
                <Column>
                  <TYPE.main>Pair Name</TYPE.main>
                  <TYPE.main style={{ marginTop: ".15rem" }}>
                    <RowFixed>
                      <FormattedName
                        text={token0?.symbol ?? ""}
                        maxCharacters={8}
                      />
                      -
                      <FormattedName
                        text={token1?.symbol ?? ""}
                        maxCharacters={8}
                      />
                    </RowFixed>
                  </TYPE.main>
                </Column>
                <Column>
                  <TYPE.main>Pair Address</TYPE.main>
                  <AutoRow align="flex-end">
                    <TYPE.main style={{ marginTop: ".15rem" }}>
                      {pairAddress.slice(0, 6) +
                        "..." +
                        pairAddress.slice(38, 42)}
                    </TYPE.main>
                    <CopyHelper toCopy={pairAddress} />
                  </AutoRow>
                </Column>
                <Column>
                  <TYPE.main>
                    <RowFixed>
                      <FormattedName
                        text={token0?.symbol ?? ""}
                        maxCharacters={8}
                      />{" "}
                      <span style={{ marginLeft: "4px" }}>Address</span>
                    </RowFixed>
                  </TYPE.main>
                  <AutoRow align="flex-end">
                    <TYPE.main style={{ marginTop: ".15rem" }}>
                      {token0 &&
                        token0.id.slice(0, 6) + "..." + token0.id.slice(38, 42)}
                    </TYPE.main>
                    <CopyHelper toCopy={token0?.id} />
                  </AutoRow>
                </Column>
                <Column>
                  <TYPE.main>
                    <RowFixed>
                      <FormattedName
                        text={token1?.symbol ?? ""}
                        maxCharacters={8}
                      />{" "}
                      <span style={{ marginLeft: "4px" }}>Address</span>
                    </RowFixed>
                  </TYPE.main>
                  <AutoRow align="flex-end">
                    <TYPE.main style={{ marginTop: ".15rem" }} fontSize={16}>
                      {token1 &&
                        token1.id.slice(0, 6) + "..." + token1.id.slice(38, 42)}
                    </TYPE.main>
                    <CopyHelper toCopy={token1?.id} />
                  </AutoRow>
                </Column>
                <ButtonLight>
                  <Link
                    external
                    href={
                      "https://xdc.blocksscan.io/address/" +
                      pairAddress.replace(/^.{2}/g, "xdc")
                    }
                  >
                    View on BlocksScan ↗
                  </Link>
                </ButtonLight>
              </TokenDetailsLayout>
            </>
          </DashboardWrapper>
        </WarningGrouping>
      </ContentWrapperLarge>
    </PageWrapper>
  );
});

type PairPageRouterComponentProps = {
  savedOpen: boolean;
  setSavedOpen: Dispatch<SetStateAction<boolean>>;
};

export const PairPageRouterComponent: FC<PairPageRouterComponentProps> = memo(
  ({ savedOpen, setSavedOpen }) => {
    const params = useParams() as Record<string, any>;
    if (
      isAddress(params.pairAddress.toLowerCase()) &&
      !Object.keys(PAIR_BLACKLIST).includes(params.pairAddress.toLowerCase())
    ) {
      return (
        <LayoutWrapper savedOpen={savedOpen} setSavedOpen={setSavedOpen}>
          <PairPage pairAddress={params.pairAddress.toLowerCase()} />
        </LayoutWrapper>
      );
    } else {
      return <Navigate to={"/charts"} />;
    }
  }
);

export default PairPage;
