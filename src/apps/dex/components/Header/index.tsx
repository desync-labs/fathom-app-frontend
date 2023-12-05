import { ChainId, TokenAmount } from "into-the-fathom-swap-sdk";
import { useState } from "react";
import { Text } from "rebass";
import { NavLink } from "react-router-dom";
import { darken } from "polished";
import { useTranslation } from "react-i18next";

import styled, { DefaultTheme } from "styled-components";

import Logo from "assets/svg/Fathom-app-logo.svg";
import { useActiveWeb3React } from "apps/dex/hooks";
import {
  useXDCBalances,
  useAggregateUniBalance,
} from "apps/dex/state/wallet/hooks";
import { CardNoise } from "apps/dex/components/earn/styled";
import { CountUp } from "use-count-up";
import { TYPE, ExternalLink } from "apps/dex/theme";

import { YellowCard } from "apps/dex/components/Card";

import Row from "apps/dex/components/Row";
import Web3Status from "apps/dex/components/Web3Status";
import Modal from "apps/dex/components/Modal";
import FathomBalanceContent from "apps/dex/components/Header/FathomBalanceContent";
import usePrevious from "apps/dex/hooks/usePrevious";

const HeaderFrame = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  border-bottom: 1px solid #2c3f59;
  padding: 1rem;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    padding: 0 1rem;
    width: calc(100%);
    position: relative;
  `};
  background: transparent;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        padding: 0.5rem 1rem;
  `}
`;

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: 100%;
    max-width: 960px;
    padding: 1rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
    height: 72px;
    border-radius: 12px 12px 0 0;
    background-color: ${({ theme }: { theme: DefaultTheme }) => theme.bg1};
  `};
`;

const HeaderElement = styled.div`
  display: flex;
  align-items: center;

  /* addresses safari's lack of support for "gap" */
  & > *:not(:first-child) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
  `};
`;

const HeaderRow = styled(Row)<{ gap?: string; justify?: string }>`
  margin: ${({ gap }) => gap && `-${gap}`};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 100%;
    background: '#fff';
  `};
`;

const HeaderLinks = styled(Row)`
  justify-content: start;
  padding-left: 150px;
  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
    padding: 1rem 0 1rem 1rem;
    justify-content: flex-start;
 `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      padding: 1rem 0 1rem 0rem;
      a {
        margin: 0 8px;
        font-size: 0.8rem;
      }
 `};
  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
      padding: 0;
 `};
`;

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.bg1};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;
  color: ${({ theme }) => theme.text1};

  :focus {
    border: 1px solid blue;
  }
`;

const FTHMAmount = styled(AccountElement)`
  color: white;
  padding: 4px 8px;
  height: 36px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.bg1};
  color: ${({ theme }) => theme.text1};
`;

const FTHMWrapper = styled.span`
  width: fit-content;
  position: relative;
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }

  :active {
    opacity: 0.9;
  }
`;

const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`;

const NetworkCard = styled(YellowCard)`
  border-radius: 12px;
  padding: 8px 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`;

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`;

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-right: 8px;
  `};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`;

const FathomIcon = styled.div`
  transition: transform 0.3s ease;
  img {
    width: 140px;
    ${({ theme }) => theme.mediaWidth.upToSmall`
      width: 80px;
    `};
  }

  :hover {
    transform: rotate(-5deg);
  }
`;

const StyledNavLink = styled(NavLink)`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;
  text-transform: capitalize;

  &.active {
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
    background-color: ${({ theme }) => theme.primary5};
    padding: 8px 12px;
    border-radius: 8px;
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin: 0 1px !important;
    padding: 4px !important;
    font-size: 0.65rem !important;
  `};
`;

const StyledExternalLink = styled(ExternalLink)`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;

  &.active {
    border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin: 0 1px !important;
    padding: 4px !important;
    font-size: 0.65rem !important;
  `};
`;

export const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  border: none;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};
  margin: 0 0 0 8px;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`;

const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.XDC]: "XDC",
  [ChainId.AXDC]: "Apothem",
};

export default function Header() {
  const { account, chainId } = useActiveWeb3React();
  const { t } = useTranslation();

  const userXDCBalance = useXDCBalances(account ? [account] : [])?.[
    account ?? ""
  ];

  const aggregateBalance: TokenAmount | undefined = useAggregateUniBalance();

  const [showUniBalanceModal, setShowUniBalanceModal] = useState(false);
  // const showClaimPopup = useShowClaimPopup()

  const countUpValue = aggregateBalance?.toFixed(0) ?? "0";
  const countUpValuePrevious = usePrevious(countUpValue) ?? "0";

  return (
    <HeaderFrame>
      {/*<ClaimModal />*/}
      <Modal
        isOpen={showUniBalanceModal}
        onDismiss={() => setShowUniBalanceModal(false)}
      >
        <FathomBalanceContent setShowUniBalanceModal={setShowUniBalanceModal} />
      </Modal>
      <HeaderRow>
        <Title href="/">
          <FathomIcon>
            <img src={Logo} alt="logo" />
          </FathomIcon>
        </Title>
        <HeaderLinks>
          <StyledNavLink id={`swap-nav-link`} to={"/swap"}>
            <>{t("swap")}</>
          </StyledNavLink>
          <StyledNavLink id={`pool-nav-link`} to={"/swap/pool"}>
            <>{t("pool")}</>
          </StyledNavLink>
          <StyledExternalLink
            id={`stake-nav-link`}
            href={"https://charts.fathom.fi/#/home"}
          >
            Charts <span style={{ fontSize: "11px" }}>↗</span>
          </StyledExternalLink>
          <StyledExternalLink
            id={`stake-nav-link`}
            href={"https://dapp.fathom.fi"}
          >
            FXD <span style={{ fontSize: "11px" }}>↗</span>
          </StyledExternalLink>
          <StyledExternalLink
            id={`stake-nav-link`}
            href={
              "https://gist.github.com/BaldyAsh/47a33c5e8005c05315cc8dfc9baa4c0e"
            }
          >
            Privacy Policy <span style={{ fontSize: "11px" }}>↗</span>
          </StyledExternalLink>
          <StyledExternalLink
            id={`stake-nav-link`}
            href={
              "https://gist.github.com/BaldyAsh/9e1efbfd87fa87fd67091b5d45c481b3"
            }
          >
            Terms of Service <span style={{ fontSize: "11px" }}>↗</span>
          </StyledExternalLink>
        </HeaderLinks>
      </HeaderRow>
      <HeaderControls>
        <HeaderElement>
          <HideSmall>
            {chainId && NETWORK_LABELS[chainId] && (
              <NetworkCard title={NETWORK_LABELS[chainId]}>
                {NETWORK_LABELS[chainId]}
              </NetworkCard>
            )}
          </HideSmall>
          {aggregateBalance && (
            <FTHMWrapper onClick={() => setShowUniBalanceModal(true)}>
              <FTHMAmount
                active={!!account /*&& !availableClaim*/}
                style={{ pointerEvents: "auto" }}
              >
                {account && (
                  <HideSmall>
                    <TYPE.white
                      style={{
                        paddingRight: ".4rem",
                      }}
                    >
                      <CountUp
                        key={countUpValue}
                        isCounting
                        start={parseFloat(countUpValuePrevious)}
                        end={parseFloat(countUpValue)}
                        thousandsSeparator={","}
                        duration={1}
                      />
                    </TYPE.white>
                  </HideSmall>
                )}
                FTHM
              </FTHMAmount>
              <CardNoise />
            </FTHMWrapper>
          )}
          <AccountElement active={!!account} style={{ pointerEvents: "auto" }}>
            {account && userXDCBalance ? (
              <BalanceText
                style={{ flexShrink: 0 }}
                pl="0.75rem"
                pr="0.5rem"
                fontWeight={500}
              >
                {userXDCBalance?.toSignificant(8)} {"XDC"}
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement>
        </HeaderElement>
      </HeaderControls>
    </HeaderFrame>
  );
}
