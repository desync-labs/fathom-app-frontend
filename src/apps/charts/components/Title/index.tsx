import styled from "styled-components";

import { Flex } from "rebass";
import Link from "apps/charts/components/Link";
import { RowFixed } from "apps/charts/components/Row";
import Logo from "apps/charts/assets/Fathom-app-logo.svg";

import { BasicLink } from "apps/charts/components/Link";
import { useMedia } from "react-use";
import { useNavigate } from "react-router-dom";

const TitleWrapper = styled.div`
  text-decoration: none;
  z-index: 10;
  width: 100%;
  &:hover {
    cursor: pointer;
  }
`;

const FathomIcon = styled(Link)`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
  img {
    width: 140px;
  }
  @media (max-width: 600px) {
    img {
      width: 90px;
    }
  }
`;

const Option = styled.div<{ activeText: boolean }>`
  font-weight: 500;
  font-size: 14px;
  opacity: ${({ activeText }) => (activeText ? 1 : 0.6)};
  color: ${({ theme }) => theme.white};
  display: flex;
  margin-left: 12px;
  :hover {
    opacity: 1;
  }
`;

export default function Title() {
  const navigate = useNavigate();
  const below1080 = useMedia("(max-width: 1080px)");

  return (
    <TitleWrapper>
      <Flex alignItems="center" style={{ justifyContent: "space-between" }}>
        <RowFixed>
          <FathomIcon id="link" onClick={() => navigate("/charts")}>
            <img src={Logo} alt="logo" />
          </FathomIcon>
        </RowFixed>
        {below1080 && (
          <RowFixed style={{ alignItems: "flex-end" }}>
            <BasicLink to="/home">
              <Option activeText={location.pathname === "/home" ?? undefined}>
                Overview
              </Option>
            </BasicLink>
            <BasicLink to="/tokens">
              <Option
                activeText={
                  (location.pathname.split("/")[1] === "tokens" ||
                    location.pathname.split("/")[1] === "token") ??
                  undefined
                }
              >
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
                Pairs
              </Option>
            </BasicLink>

            <BasicLink to="/accounts">
              <Option
                activeText={
                  (history.location.pathname.split("/")[1] === "accounts" ||
                    history.location.pathname.split("/")[1] === "account") ??
                  undefined
                }
              >
                Accounts
              </Option>
            </BasicLink>
          </RowFixed>
        )}
      </Flex>
    </TitleWrapper>
  );
}
