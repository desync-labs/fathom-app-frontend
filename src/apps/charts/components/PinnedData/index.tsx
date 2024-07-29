import { Dispatch, FC, memo, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, styled } from "@mui/material";
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
import { ButtonFaded } from "apps/charts/components/ButtonStyled";
import FormattedName from "apps/charts/components/FormattedName";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CloseIcon from "@mui/icons-material/Close";

const RightColumn = styled(Box)<{ open?: boolean; scrolled: number }>`
  position: fixed;
  right: 0;
  top: ${({ scrolled }) => (scrolled < 60 ? `${60 - scrolled}px` : "0")};
  height: 100vh;
  width: ${({ open }) => (open ? "220px" : "64px")};
  padding: 1.25rem;
  border-left: 1px solid #2c4066;
  background-color: #132340;
  z-index: 9999;
  overflow: auto;

  :hover {
    cursor: pointer;
  }
`;

const SavedButton = styled(RowBetween)<{ open?: boolean }>`
  padding-bottom: ${({ open }) => open && "20px"};
  border-bottom: ${({ open }) => open && "1px solid #253656"};
  margin-bottom: ${({ open }) => open && "1.25rem"};

  :hover {
    cursor: pointer;
  }
`;

const ScrollableDiv = styled(AutoColumn)`
  overflow: auto;
  padding-bottom: 60px;
`;

const StyledIcon = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0;
  :hover {
    background-color: unset;
    opacity: 0.7;
  }
`;

type PinnedDataProps = {
  open: boolean;
  setSavedOpen: Dispatch<SetStateAction<boolean>>;
};

const PinnedData: FC<PinnedDataProps> = (props) => {
  const { open, setSavedOpen } = props;
  const navigate = useNavigate();
  const [savedPairs, , removePair] = useSavedPairs();
  const [savedTokens, , removeToken] = useSavedTokens();
  const [scrolled, setScrolled] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [setScrolled]);

  return !open ? (
    <RightColumn
      open={open}
      onClick={() => setSavedOpen(true)}
      scrolled={scrolled}
    >
      <SavedButton open={open}>
        <StyledIcon color={"#43fff6"}>
          <BookmarkBorderIcon sx={{ width: 24, height: 24 }} />
        </StyledIcon>
      </SavedButton>
    </RightColumn>
  ) : (
    <RightColumn open={open} scrolled={scrolled}>
      <SavedButton onClick={() => setSavedOpen(false)} open={open}>
        <RowFixed>
          <StyledIcon color={"#43fff6"}>
            <BookmarkBorderIcon sx={{ width: 20, height: 20 }} />
          </StyledIcon>
          <TYPE.main ml={"5px"}>Saved</TYPE.main>
        </RowFixed>
        <StyledIcon color={"#43fff6"}>
          <ChevronRightIcon sx={{ width: 28, height: 28 }} />
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
                  <RowBetween key={pair.address} gap={"8px"}>
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
                        <CloseIcon sx={{ width: 16, height: 16 }} />
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
                  <RowBetween key={address} gap={"8px"}>
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
                        <CloseIcon sx={{ width: 16, height: 16 }} />
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
};

export default memo(PinnedData);
