import { FC, memo } from "react";
import { Box, styled } from "@mui/material";
import {
  AppNavItem,
  AppNavWrapper,
} from "components/AppComponents/AppTabs/AppTabs";
import { ProposalsTabs } from "hooks/Governance/useAllProposals";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { ButtonPrimary } from "components/AppComponents/AppButton/AppButton";
import { useNavigate } from "react-router-dom";

const ViewAllProposalsTabsWrapper = styled(AppNavWrapper)`
  ${({ theme }) => theme.breakpoints.down("sm")} {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 24px;
    width: 100%;
    background: #2c4066;
    padding: 0 16px;
    z-index: 9;
  }
  width: 100%;
  padding-bottom: 10px;
  justify-content: space-between;
`;
const ViewAllProposalsTabsItem = styled(AppNavItem)`
  ${({ theme }) => theme.breakpoints.down("sm")} {
    height: 48px;
    width: fit-content;
    min-width: unset;
    font-size: 11px;
    font-weight: 600;
    padding: 0;
  }

  &.active {
    color: #fff;
    border: none;
    border-radius: 8px;
    background: #3d5580;
    padding: 8px 16px;
  }
`;

const AddProposalButton = styled(ButtonPrimary)`
  float: right;
  padding: 8px 40px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    margin-top: 10px;
  }
`;

const TabWrapper = styled(Box)`
  display: flex;
`;

export const AddProposalBtnComponent = () => {
  const navigate = useNavigate();
  return (
    <AddProposalButton
      onClick={() => navigate("/dao/governance/proposal/create")}
    >
      <AddCircleIcon
        sx={{
          color: "#005C55",
          fontSize: "16px",
          marginRight: "7px",
        }}
      />
      Create a proposal
    </AddProposalButton>
  );
};

const ProposalsListTabs: FC<{
  tab: ProposalsTabs;
}> = ({ tab }) => {
  const navigate = useNavigate();

  return (
    <ViewAllProposalsTabsWrapper>
      <TabWrapper>
        <ViewAllProposalsTabsItem
          onClick={() => navigate("/dao/governance")}
          className={tab === ProposalsTabs.PROPOSALS ? "active" : ""}
        >
          Proposals
        </ViewAllProposalsTabsItem>
        <ViewAllProposalsTabsItem
          onClick={() => navigate("/dao/governance/drafts")}
          className={tab === ProposalsTabs.DRAFTS ? "active" : ""}
        >
          Drafts
        </ViewAllProposalsTabsItem>
      </TabWrapper>
      {tab !== ProposalsTabs.DRAFTS && <AddProposalBtnComponent />}
    </ViewAllProposalsTabsWrapper>
  );
};

export default memo(ProposalsListTabs);
