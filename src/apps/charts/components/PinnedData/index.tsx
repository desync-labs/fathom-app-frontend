import styled from "styled-components";
import { RowBetween, RowFixed } from "apps/charts/components/Row";
import { AutoColumn } from "apps/charts/components/Column";
import { TYPE } from "apps/charts/Theme";
import {
  useSavedTokens,
  useSavedPairs,
} from "apps/charts/contexts/LocalStorage";
import { Hover } from "apps/charts/components";
import TokenLogo from "apps/charts/components/TokenLogo";
import AccountSearch from "apps/charts/components/AccountSearch";
import { Bookmark, ChevronRight, X } from "react-feather";
import { ButtonFaded } from "apps/charts/components/ButtonStyled";
import FormattedName from "apps/charts/components/FormattedName";
import { useNavigate } from "react-router-dom";

const RightColumn = styled.div<{ open?: boolean }>`
  position: fixed;
  right: 0;
  top: 60px;
  height: 100vh;
  width: ${({ open }) => (open ? "160px" : "64px")};
  padding: 1.25rem;
  border-left: ${({ theme }) => "1px solid" + theme.borderBG};
  background-color: ${({ theme }) => theme.bg1};
  z-index: 9999;
  overflow: auto;
  :hover {
    cursor: pointer;
  }
`;

const SavedButton = styled(RowBetween)`
  padding-bottom: ${({ open }) => open && "20px"};
  border-bottom: ${({ theme, open }) => open && "1px solid" + theme.borderBG};
  margin-bottom: ${({ open }) => open && "1.25rem"};

  :hover {
    cursor: pointer;
  }
`;

const ScrollableDiv = styled(AutoColumn)`
  overflow: auto;
  padding-bottom: 60px;
`;

const StyledIcon = styled.div`
  color: ${({ theme }) => theme.text5};
`;

function PinnedData(props: { open: any; setSavedOpen: any }) {
  const { open, setSavedOpen } = props;
  const navigate = useNavigate();
  const [savedPairs, , removePair] = useSavedPairs();
  const [savedTokens, , removeToken] = useSavedTokens();

  return !open ? (
    <RightColumn open={open} onClick={() => setSavedOpen(true)}>
      <SavedButton open={open}>
        <StyledIcon>
          <Bookmark size={20} />
        </StyledIcon>
      </SavedButton>
    </RightColumn>
  ) : (
    <RightColumn open={open}>
      <SavedButton onClick={() => setSavedOpen(false)} open={open}>
        <RowFixed>
          <StyledIcon>
            <Bookmark size={16} />
          </StyledIcon>
          <TYPE.main ml={"4px"}>Saved</TYPE.main>
        </RowFixed>
        <StyledIcon>
          <ChevronRight />
        </StyledIcon>
      </SavedButton>
      <AccountSearch small={true} />
      <AutoColumn gap="40px" style={{ marginTop: "2rem" }}>
        <AutoColumn gap={"12px"}>
          <TYPE.main>Pinned Pairs</TYPE.main>
          {Object.keys(savedPairs).filter((key) => {
            return !!savedPairs[key];
          }).length > 0 ? (
            Object.keys(savedPairs)
              .filter((address) => {
                return !!savedPairs[address];
              })
              .map((address) => {
                const pair = savedPairs[address];
                return (
                  <RowBetween key={pair.address}>
                    <ButtonFaded
                      onClick={() => navigate("/charts/pair/" + address)}
                    >
                      <RowFixed>
                        <TYPE.header>
                          <FormattedName
                            text={pair.token0Symbol + "/" + pair.token1Symbol}
                            maxCharacters={12}
                            fontSize={"12px"}
                          />
                        </TYPE.header>
                      </RowFixed>
                    </ButtonFaded>
                    <Hover onClick={() => removePair(pair.address)}>
                      <StyledIcon>
                        <X size={16} />
                      </StyledIcon>
                    </Hover>
                  </RowBetween>
                );
              })
          ) : (
            <TYPE.light>Pinned pairs will appear here.</TYPE.light>
          )}
        </AutoColumn>
        <ScrollableDiv gap={"12px"}>
          <TYPE.main>Pinned Tokens</TYPE.main>
          {Object.keys(savedTokens).filter((key) => {
            return !!savedTokens[key];
          }).length > 0 ? (
            Object.keys(savedTokens)
              .filter((address) => {
                return !!savedTokens[address];
              })
              .map((address) => {
                const token = savedTokens[address];
                return (
                  <RowBetween key={address}>
                    <ButtonFaded
                      onClick={() => navigate("/charts/token/" + address)}
                    >
                      <RowFixed>
                        <TokenLogo address={address} size={"14px"} />
                        <TYPE.header ml={"6px"}>
                          <FormattedName
                            text={token.symbol}
                            maxCharacters={12}
                            fontSize={"12px"}
                          />
                        </TYPE.header>
                      </RowFixed>
                    </ButtonFaded>
                    <Hover onClick={() => removeToken(address)}>
                      <StyledIcon>
                        <X size={16} />
                      </StyledIcon>
                    </Hover>
                  </RowBetween>
                );
              })
          ) : (
            <TYPE.light>Pinned tokens will appear here.</TYPE.light>
          )}
        </ScrollableDiv>
      </AutoColumn>
    </RightColumn>
  );
}

export default PinnedData;
