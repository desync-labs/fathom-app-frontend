import { FC } from "react";
import { useDispatch } from "react-redux";
import { darken } from "polished";
import { NavLink, Link as HistoryLink } from "react-router-dom";
import { Box, styled } from "@mui/material";

import { AppDispatch } from "apps/dex/state";
import { resetMintState } from "apps/dex/state/mint/actions";
import Settings from "apps/dex/components/Settings";
import { RowBetween } from "apps/dex/components/Row";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Tabs = styled(Box)`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  height: 3rem;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: #00332f;
  font-size: 20px;

  :hover,
  :focus {
    color: ${darken(0.1, "#ffffff")};
  }
`;

const ActiveText = styled(Box)`
  font-weight: 500;
  font-size: 20px;
`;

const StyledArrowLeft = styled(ArrowBackIcon)`
  color: #ffffff;
`;

export const SwapPoolTabs = () => {
  return (
    <Tabs style={{ marginBottom: "20px", display: "none" }}>
      <StyledNavLink id={`swap-nav-link`} to={"/swap"}>
        <>Swap</>
      </StyledNavLink>
      <StyledNavLink id={`pool-nav-link`} to={"/swap/pool"}>
        <>Pool</>
      </StyledNavLink>
    </Tabs>
  );
};

export const FindPoolTabs = () => {
  return (
    <Tabs>
      <RowBetween style={{ padding: "1rem 1rem 0 1rem" }}>
        <HistoryLink to="/swap/pool">
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>Import Pool</ActiveText>
        <Settings />
      </RowBetween>
    </Tabs>
  );
};

type AddRemoveTabsProps = {
  adding: boolean;
  creating: boolean;
};

export const AddRemoveTabs: FC<AddRemoveTabsProps> = ({ adding, creating }) => {
  // reset states on back
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Tabs>
      <RowBetween style={{ padding: "1rem 1rem 0 1rem" }}>
        <HistoryLink
          to="/swap/pool"
          onClick={() => {
            adding && dispatch(resetMintState());
          }}
        >
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>
          {creating
            ? "Create a pair"
            : adding
            ? "Add Liquidity"
            : "Remove Liquidity"}
        </ActiveText>
        <Settings />
      </RowBetween>
    </Tabs>
  );
};
