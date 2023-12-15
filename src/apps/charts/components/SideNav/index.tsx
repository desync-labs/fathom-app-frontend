import styled from "styled-components";
import { AutoColumn } from "apps/charts/components/Column";
import Title from "apps/charts/components/Title";
import { BasicLink } from "apps/charts/components/Link";
import { useMedia } from "react-use";
import { TYPE } from "apps/charts/Theme";
import { TrendingUp, List, PieChart, Disc } from "react-feather";
import Link from "apps/charts/components/Link";
import { useSessionStart } from "apps/charts/contexts/Application";

const Wrapper = styled.div<{ isMobile?: boolean }>`
  height: ${({ isMobile }) => (isMobile ? "initial" : "100vh")};
  background-color: ${({ theme }) => theme.bg1};
  color: ${({ theme }) => theme.text1};
  padding: 0.5rem 0.5rem 0.5rem 0.75rem;
  position: sticky;
  top: 0px;
  z-index: 9999;
  box-sizing: border-box;
  border-right: 1px solid #2c3f59;
  color: ${({ theme }) => theme.bg2};

  @media screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    position: relative;
  }

  @media screen and (max-width: 600px) {
    padding: 1rem;
  }
`;

const Option = styled.div<{ activeText?: boolean }>(({ theme, activeText }) => {
  let styles = {
    fontSize: "14px",
    opacity: activeText ? 1 : 0.6,
    color: theme.white,
    display: "flex",
    padding: "8px 12px",
    ":hover": {
      opacity: 1,
    },
  };

  if (activeText) {
    styles = {
      ...styles,
      fontWeight: 600,
      color: "#fff",
      backgroundColor: "#22354F",
      borderRadius: "8px",
    };
  }

  return styles;
});

const DesktopWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
`;

const MobileWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderText = styled.div`
  margin-right: 0.75rem;
  font-size: 0.825rem;
  font-weight: 500;
  display: inline-block;
  opacity: 0.8;
  :hover {
    opacity: 1;
  }
  a {
    color: ${({ theme }) => theme.white};
  }
`;

const Polling = styled.div`
  position: fixed;
  display: flex;
  left: 0;
  bottom: 0;
  padding: 1rem;
  color: white;
  opacity: 0.4;
  transition: opacity 0.25s ease;
  :hover {
    opacity: 1;
  }
`;
const PollingDot = styled.div`
  width: 8px;
  height: 8px;
  min-height: 8px;
  min-width: 8px;
  margin-right: 0.5rem;
  margin-top: 3px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.green1};
`;

function SideNav() {
  const below1080 = useMedia("(max-width: 1080px)");

  const below1180 = useMedia("(max-width: 1180px)");

  const seconds = useSessionStart();

  // const [isDark, toggleDarkMode] = useDarkModeManager()

  return (
    <Wrapper isMobile={below1080}>
      {!below1080 ? (
        <DesktopWrapper>
          <AutoColumn
            gap="1rem"
            style={{ marginLeft: ".5rem", marginTop: "1.5rem" }}
          >
            <Title />
            {!below1080 && (
              <AutoColumn gap="0.75rem" style={{ marginTop: "1rem" }}>
                <BasicLink to="/home">
                  <Option
                    activeText={
                      history.location.pathname === "/home" ?? undefined
                    }
                  >
                    <TrendingUp
                      size={20}
                      style={{ marginRight: ".75rem", marginTop: "-0.1rem" }}
                    />
                    Overview
                  </Option>
                </BasicLink>
                <BasicLink to="/tokens">
                  <Option
                    activeText={
                      (history.location.pathname.split("/")[1] === "tokens" ||
                        history.location.pathname.split("/")[1] === "token") ??
                      undefined
                    }
                  >
                    <Disc
                      size={20}
                      style={{ marginRight: ".75rem", marginTop: "-0.1rem" }}
                    />
                    Tokens
                  </Option>
                </BasicLink>
                <BasicLink to="/pairs">
                  <Option
                    activeText={
                      (location.pathname.split("/")[1] === "pairs" ||
                        location.pathname.split("/")[1] === "pair") ??
                      undefined
                    }
                  >
                    <PieChart
                      size={20}
                      style={{ marginRight: ".75rem", marginTop: "-0.1rem" }}
                    />
                    Pairs
                  </Option>
                </BasicLink>

                <BasicLink to="/accounts">
                  <Option
                    activeText={
                      (location.pathname.split("/")[1] === "accounts" ||
                        location.pathname.split("/")[1] === "account") ??
                      undefined
                    }
                  >
                    <List
                      size={20}
                      style={{ marginRight: ".75rem", marginTop: "-0.1rem" }}
                    />
                    Accounts
                  </Option>
                </BasicLink>
              </AutoColumn>
            )}
          </AutoColumn>
          <AutoColumn
            gap="0.5rem"
            style={{ marginLeft: ".75rem", marginBottom: "4rem" }}
          >
            <HeaderText>
              <Link href="https://fathom.fi/" target="_blank">
                Fathom.fi
              </Link>
            </HeaderText>
            {/* <HeaderText>
              <Link href="https://v1.uniswap.info" target="_blank">
                V1 Analytics
              </Link>
            </HeaderText> */}
            <HeaderText>
              <Link
                href="https://gist.github.com/BaldyAsh/3676a18b003758057f634c9af2cfe49a"
                target="_blank"
              >
                Docs
              </Link>
            </HeaderText>
            <HeaderText>
              <Link href="https://t.me/fathom_fi" target="_blank">
                Telegram
              </Link>
            </HeaderText>
            <HeaderText>
              <Link href="https://twitter.com/Fathom_fi" target="_blank">
                Twitter
              </Link>
            </HeaderText>
            <HeaderText>
              <Link
                href="https://gist.github.com/BaldyAsh/47a33c5e8005c05315cc8dfc9baa4c0e"
                target="_blank"
              >
                Privacy Policy
              </Link>
            </HeaderText>
            <HeaderText>
              <Link
                href="https://gist.github.com/BaldyAsh/9e1efbfd87fa87fd67091b5d45c481b3"
                target="_blank"
              >
                Terms of Service
              </Link>
            </HeaderText>
            {/*<Toggle isActive={isDark} toggle={toggleDarkMode} />*/}
          </AutoColumn>
          {!below1180 && (
            <Polling style={{ marginLeft: ".5rem" }}>
              <PollingDot />
              <a href="/" style={{ color: "white" }}>
                <TYPE.small color={"white"}>
                  Updated {seconds ? seconds + "s" : "-"} ago <br />
                </TYPE.small>
              </a>
            </Polling>
          )}
        </DesktopWrapper>
      ) : (
        <MobileWrapper>
          <Title />
        </MobileWrapper>
      )}
    </Wrapper>
  );
}

export default SideNav;
