import { Link, Outlet, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Container } from "@mui/material";
import { useMemo } from "react";
import { GovernanceIcon, StakingIcon } from "components/Common/MenuIcons";

const DaoNav = styled("nav")`
  height: 65px;
  width: 100%;
  border-bottom: 1.5px solid #1d2d49;
  display: flex;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    a {
      width: 50%;
    }
  }
`;

const DaoLink = styled(Link)`
  color: #9fadc6;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 100%;
  padding: 0 52px;
  font-weight: 600;
  font-size: 17px;

  &.active {
    color: #fff;
    border-bottom: 1px solid #00fff6;
    background: #131f35;
  }

  span {
    margin-bottom: 5px;
  }
`;

const DaoContainer = styled(Container)`
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin-top: 15px;
  }
`;

const DaoView = () => {
  const location = useLocation();

  const isStakingActive = useMemo(
    () => location.pathname.includes("staking"),
    [location.pathname]
  );

  const isGovernmentActive = useMemo(
    () => location.pathname.includes("governance"),
    [location.pathname]
  );

  return (
    <>
      <DaoNav>
        <DaoLink className={isStakingActive ? "active" : ""} to="staking">
          <StakingIcon isStakingActive={isStakingActive} />
          Staking
        </DaoLink>
        <DaoLink className={isGovernmentActive ? "active" : ""} to="governance">
          <GovernanceIcon isDAOActive={isGovernmentActive} />
          Governance
        </DaoLink>
      </DaoNav>
      <DaoContainer maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Outlet />
      </DaoContainer>
    </>
  );
};

export default DaoView;
